import { Link } from 'react-router-dom';
import { Bell, ArrowRight } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { useReminders } from '@/hooks/useReminders';

export const ReminderWidget = () => {
  const { data, isLoading } = useReminders(false);

  const reminders = (data?.reminders ?? [])
    .filter((r) => r.job != null && r.status !== 'done')
    .sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime());

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

  const next = reminders[0];
  const remaining = reminders.length - 1;
  const urgent = isUrgent(next.remindAt);

  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 mb-5 flex flex-wrap items-center justify-between gap-3">
      <Link
        to={`/job/${next.job!._id}`}
        className="flex items-center gap-2.5 min-w-0 flex-1 group"
      >
        <Bell className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            urgent ? 'bg-warning' : 'bg-muted-foreground'
          }`}
        />
        <span className="font-mono text-[11px] text-muted-foreground shrink-0">
          {formatReminderDate(next.remindAt)}
        </span>
        <span className="text-xs font-medium text-foreground truncate group-hover:underline underline-offset-4">
          {next.job!.position} · {next.job!.company}
        </span>
        {remaining > 0 && (
          <span className="hidden sm:inline font-mono text-[11px] text-muted-foreground shrink-0">
            +{remaining} more
          </span>
        )}
      </Link>

      <Link
        to="/reminders"
        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors shrink-0"
      >
        All reminders
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};
