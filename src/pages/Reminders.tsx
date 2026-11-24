import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format, isFuture, isPast } from 'date-fns';
import { Bell, CheckCircle2, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { useDeleteReminder, useReminders, useUpdateReminder } from '@/hooks/useReminders';
import { Reminder } from '@/types/reminder';
import { CompanyAvatar } from '@/components/CompanyAvatar';
import { Navbar } from '@/components/Navbar';
import { QueryErrorState } from '@/components/QueryErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Reminders = () => {
  const navigate = useNavigate();
  const [includePast, setIncludePast] = useState(false);

  const { data, isLoading, isError, error, refetch } = useReminders(includePast);
  const updateReminderMutation = useUpdateReminder();
  const deleteReminderMutation = useDeleteReminder();

  const reminders = (data?.reminders ?? []).filter((r) => r.job != null);
  const upcomingReminders = reminders.filter(
    (r) => r.status !== 'done' && isFuture(new Date(r.remindAt))
  );
  const pastOrDoneReminders = reminders.filter(
    (r) => r.status === 'done' || isPast(new Date(r.remindAt))
  );

  const handleToggleDone = async (reminder: Reminder) => {
    const nextStatus = reminder.status === 'done' ? 'pending' : 'done';
    try {
      await updateReminderMutation.mutateAsync({
        id: reminder._id,
        data: { status: nextStatus },
      });
      toast.success(nextStatus === 'done' ? 'Reminder marked complete' : 'Reminder reopened');
    } catch {
      toast.error('Failed to update reminder');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReminderMutation.mutateAsync(id);
      toast.success('Reminder deleted');
    } catch {
      toast.error('Failed to delete reminder');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reminders</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Scheduled follow-ups across your applications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="include-past"
              checked={includePast}
              onCheckedChange={setIncludePast}
            />
            <Label htmlFor="include-past" className="text-xs text-muted-foreground">
              Show past & done
            </Label>
          </div>
        </div>

        {isError ? (
          <QueryErrorState
            title="Unable to load reminders"
            message={error instanceof Error ? error.message : 'Please try again.'}
            onRetry={() => void refetch()}
          />
        ) : reminders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto w-10 h-10 rounded-lg border border-border bg-secondary flex items-center justify-center mb-3">
              <Bell className="w-4 h-4 text-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">No reminders</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Open any application to schedule a follow-up reminder.
            </p>
            <Button size="sm" onClick={() => navigate('/dashboard')}>
              Go to Pipeline
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingReminders.length > 0 && (
              <div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
                  Upcoming ({upcomingReminders.length})
                </h2>
                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                  {upcomingReminders.map((reminder) => (
                    <ReminderRow
                      key={reminder._id}
                      reminder={reminder}
                      onToggleDone={handleToggleDone}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastOrDoneReminders.length > 0 && (
              <div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
                  Completed / Past ({pastOrDoneReminders.length})
                </h2>
                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden opacity-75">
                  {pastOrDoneReminders.map((reminder) => (
                    <ReminderRow
                      key={reminder._id}
                      reminder={reminder}
                      onToggleDone={handleToggleDone}
                      onDelete={handleDelete}
                      isPastOrDone
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

interface ReminderRowProps {
  reminder: Reminder;
  onToggleDone: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  isPastOrDone?: boolean;
}

const ReminderRow = ({
  reminder,
  onToggleDone,
  onDelete,
  isPastOrDone,
}: ReminderRowProps) => {
  if (!reminder.job) return null;
  const isDone = reminder.status === 'done';

  return (
    <div className="px-4 py-3.5 group hover:bg-secondary/35 transition-colors flex items-start justify-between gap-4">
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <CompanyAvatar company={reminder.job.company} className="mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/job/${reminder.job._id}`}
              className={`text-sm font-medium hover:underline underline-offset-4 ${
                isDone ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {reminder.job.position}
            </Link>
            <span className="text-xs text-muted-foreground">· {reminder.job.company}</span>
          </div>
          {reminder.note && (
            <p className="text-xs text-muted-foreground mt-1">{reminder.note}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge
              variant={isDone ? 'success' : isPastOrDone ? 'secondary' : 'pending'}
              className="font-mono text-[11px]"
            >
              {format(new Date(reminder.remindAt), 'MMM d, yyyy · h:mm a')}
            </Badge>
            <Badge variant={reminder.job.status}>{reminder.job.status}</Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleDone(reminder)}
          title={isDone ? 'Reopen reminder' : 'Mark as done'}
          className="h-8 w-8 text-muted-foreground hover:text-success"
        >
          {isDone ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(reminder._id)}
          title="Delete reminder"
          className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Reminders;
