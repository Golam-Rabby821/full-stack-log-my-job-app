import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { remindersApi } from '@/lib/api';
import { Reminder } from '@/types/reminder';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format, isPast, isFuture } from 'date-fns';
import { Loader2, Bell, Trash2, Calendar, Building2, Briefcase, Clock } from 'lucide-react';

const Reminders = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [includePast, setIncludePast] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReminders();
    }
  }, [isAuthenticated, includePast]);

  const fetchReminders = async () => {
    try {
      const response = await remindersApi.getAll(includePast);
      setReminders(response.reminders);
    } catch (error) {
      toast.error('Failed to fetch reminders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await remindersApi.delete(id);
      setReminders(reminders.filter(r => r._id !== id));
      toast.success('Reminder deleted');
    } catch (error) {
      toast.error('Failed to delete reminder');
    } finally {
      setDeletingId(null);
    }
  };

  const upcomingReminders = reminders.filter(r => isFuture(new Date(r.remindAt)));
  const pastReminders = reminders.filter(r => isPast(new Date(r.remindAt)));

  if (authLoading || isLoading) {
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
              Show past
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
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Reminders */}
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
                      onDelete={handleDelete}
                      isDeleting={deletingId === reminder._id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Reminders */}
            {includePast && pastReminders.length > 0 && (
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Past ({pastReminders.length})
                </h2>
                <div className="space-y-3 opacity-60">
                  {pastReminders.map((reminder) => (
                    <ReminderCard 
                      key={reminder._id} 
                      reminder={reminder} 
                      onDelete={handleDelete}
                      isDeleting={deletingId === reminder._id}
                      isPast
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
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isPast?: boolean;
}

const ReminderCard = ({ reminder, onDelete, isDeleting, isPast }: ReminderCardProps) => {
  return (
    <div className="glass rounded-xl p-5 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${isPast ? 'bg-muted' : 'bg-warning/10'}`}>
            <Bell className={`w-5 h-5 ${isPast ? 'text-muted-foreground' : 'text-warning'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <Link 
              to={`/job/${reminder.job._id}`}
              className="font-semibold text-foreground hover:text-primary transition-colors"
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
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={isPast ? 'secondary' : 'pending'} className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(reminder.remindAt), 'MMM d, yyyy h:mm a')}
              </Badge>
              <Badge variant={reminder.job.status}>{reminder.job.status}</Badge>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(reminder._id)}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Reminders;
