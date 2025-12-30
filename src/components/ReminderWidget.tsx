import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { remindersApi } from '@/lib/api';
import { Reminder } from '@/types/reminder';
import { Bell, ArrowRight, Calendar } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

export const ReminderWidget = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await remindersApi.getAll(false);
        // Sort by remindAt and take first 3
        const sorted = response.reminders
          .sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime())
          .slice(0, 3);
        setReminders(sorted);
      } catch (error) {
        // Silent fail - widget is non-critical
        console.error('Failed to fetch reminders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  const isUrgent = (dateString: string) => {
    const date = new Date(dateString);
    return isToday(date) || isPast(date);
  };

  if (isLoading) {
    return (
      <div className="glass-card p-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-muted/50 rounded animate-pulse mb-2" />
            <div className="h-3 w-48 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return null; // Don't show widget if no reminders
  }

  return (
    <div className="glass-card p-4 mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">
            Upcoming Reminders
            <span className="ml-2 text-xs font-normal text-muted-foreground">({reminders.length})</span>
          </h3>
        </div>
        <Link 
          to="/reminders" 
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <Link
            key={reminder._id}
            to={`/job/${reminder.job._id}`}
            className="block p-3 rounded-lg bg-background/50 hover:bg-background/80 border border-border/50 transition-all hover:border-primary/30 group"
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isUrgent(reminder.remindAt) 
                  ? 'bg-warning/10 text-warning' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {reminder.job.position} at {reminder.job.company}
                </p>
                <p className={`text-sm ${
                  isUrgent(reminder.remindAt) ? 'text-warning' : 'text-muted-foreground'
                }`}>
                  {formatReminderDate(reminder.remindAt)}
                  {reminder.note && (
                    <span className="text-muted-foreground"> — "{reminder.note}"</span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
