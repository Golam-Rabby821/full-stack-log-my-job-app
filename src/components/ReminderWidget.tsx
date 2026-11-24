import { Link } from 'react-router-dom';
import { Bell, ArrowRight } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { useReminders } from '@/hooks/useReminders';

export const ReminderWidget = () => {
  const { data, isLoading } = useReminders(false);

  const reminders = (data?.reminders ?? [])
    .filter((r) => r.job != null && r.status !== 'done')
    .sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime())
    .slice(0, 3);

  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return `Today · ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow · ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d · h:mm a');
  };

  const isUrgent = (dateString: string) => {
    const date = new Date(dateString);
    return isToday(date) || isPast(date);
  };

  if (isLoading || reminders.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/35">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            Upcoming Follow-ups
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            ({reminders.length})
          </span>
        </div>
        <Link
          to="/reminders"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {reminders.map((reminder) => {
          const urgent = isUrgent(reminder.remindAt);
          return (
            <Link
              key={reminder._id}
              to={`/job/${reminder.job!._id}`}
              className="px-4 py-3 hover:bg-secondary/35 transition-colors block min-w-0 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    urgent ? 'bg-warning' : 'bg-muted-foreground'
                  }`}
                />
                <span
                  className={`font-mono text-[11px] ${
                    urgent ? 'text-warning font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {formatReminderDate(reminder.remindAt)}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate group-hover:underline underline-offset-4">
                {reminder.job!.position} · {reminder.job!.company}
              </p>
              {reminder.note && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{reminder.note}</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
