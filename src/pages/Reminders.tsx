import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format, isFuture, isPast } from 'date-fns';
import { Bell, Building2, Calendar, CheckCircle2, Clock, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { useDeleteReminder, useReminders, useUpdateReminder } from '@/hooks/useReminders';
import { Reminder } from '@/types/reminder';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Reminders = () => {
  const navigate = useNavigate();
  const [includePast, setIncludePast] = useState(false);

  const { data, isLoading } = useReminders(includePast);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Reminders</h1>
            <p className="text-muted-foreground">Stay on top of your job applications</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="include-past"
              checked={includePast}
              onCheckedChange={setIncludePast}
            />
            <Label htmlFor="include-past" className="text-sm text-muted-foreground">
              Show past & done
            </Label>
          </div>
        </div>

        {reminders.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center animate-fade-in">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No reminders</h2>
            <p className="text-muted-foreground mb-4">
              Set reminders on job applications to stay organized
            </p>
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingReminders.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning" />
                  Upcoming ({upcomingReminders.length})
                </h2>
                <div className="space-y-3">
                  {upcomingReminders.map((reminder) => (
                    <ReminderCard
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
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Completed / Past ({pastOrDoneReminders.length})
                </h2>
                <div className="space-y-3 opacity-75">
                  {pastOrDoneReminders.map((reminder) => (
                    <ReminderCard
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

interface ReminderCardProps {
  reminder: Reminder;
  onToggleDone: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  isPastOrDone?: boolean;
}

const ReminderCard = ({
  reminder,
  onToggleDone,
  onDelete,
  isPastOrDone,
}: ReminderCardProps) => {
  if (!reminder.job) return null;
  const isDone = reminder.status === 'done';

  return (
    <div className="glass rounded-xl p-5 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl ${
              isDone ? 'bg-success/10' : isPastOrDone ? 'bg-muted' : 'bg-warning/10'
            }`}
          >
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <Bell
                className={`w-5 h-5 ${isPastOrDone ? 'text-muted-foreground' : 'text-warning'}`}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              to={`/job/${reminder.job._id}`}
              className={`font-semibold transition-colors hover:text-primary ${
                isDone ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {reminder.job.position}
            </Link>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5" />
              {reminder.job.company}
            </p>
            {reminder.note && (
              <p className="text-sm text-muted-foreground mt-2 italic">"{reminder.note}"</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant={isDone ? 'success' : isPastOrDone ? 'secondary' : 'pending'} className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(reminder.remindAt), 'MMM d, yyyy h:mm a')}
              </Badge>
              <Badge variant={reminder.job.status}>{reminder.job.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleDone(reminder)}
            title={isDone ? 'Reopen reminder' : 'Mark as done'}
            className="text-muted-foreground hover:text-success"
          >
            {isDone ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(reminder._id)}
            title="Delete reminder"
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
