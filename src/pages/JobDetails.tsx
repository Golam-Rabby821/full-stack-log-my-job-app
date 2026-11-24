import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Send,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  useAddNote,
  useDeleteJob,
  useDeleteNote,
  useJob,
  useJobNotes,
  useJobTimeline,
  useUpdateJob,
} from '@/hooks/useJobs';
import { useCreateReminder } from '@/hooks/useReminders';
import { CreateJobData, JobStatus } from '@/types/job';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { JobModal } from '@/components/JobModal';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const getStatusVariant = (status: JobStatus): JobStatus => status;

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: jobData, isLoading, isError } = useJob(id);
  const { data: notesData } = useJobNotes(id);
  const { data: timelineData } = useJobTimeline(id);

  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();
  const addNoteMutation = useAddNote();
  const deleteNoteMutation = useDeleteNote();
  const createReminderMutation = useCreateReminder();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [showReminderForm, setShowReminderForm] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch job details');
      navigate('/dashboard');
    }
  }, [isError, navigate]);

  const job = jobData?.job;
  const notes = notesData?.notes ?? job?.notes ?? [];
  const timeline = timelineData?.timeline ?? job?.timeline ?? [];

  const handleUpdateJob = async (data: CreateJobData) => {
    if (!job) return;
    try {
      await updateJobMutation.mutateAsync({ id: job._id, data });
      setIsEditModalOpen(false);
      toast.success('Job updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
      throw error;
    }
  };

  const handleDeleteJob = async () => {
    if (!job) return;
    try {
      await deleteJobMutation.mutateAsync(job._id);
      toast.success('Job deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    }
  };

  const handleAddNote = async () => {
    if (!job || !newNote.trim()) return;
    try {
      await addNoteMutation.mutateAsync({ jobId: job._id, text: newNote.trim() });
      setNewNote('');
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!job) return;
    try {
      await deleteNoteMutation.mutateAsync({ jobId: job._id, noteId });
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleSetReminder = async () => {
    if (!job || !reminderDate) return;
    try {
      await createReminderMutation.mutateAsync({
        jobId: job._id,
        data: {
          remindAt: reminderDate,
          note: reminderNote || undefined,
        },
      });
      toast.success('Reminder set');
      setShowReminderForm(false);
      setReminderDate('');
      setReminderNote('');
    } catch {
      toast.error('Failed to set reminder');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-xl p-8 animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">{job.position}</h1>
                    <p className="text-lg text-muted-foreground mb-3">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusVariant(job.status)} className="text-sm">
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                      {job.priority && job.priority !== 'medium' && (
                        <Badge variant={job.priority} className="text-sm">
                          {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)} Priority
                        </Badge>
                      )}
                      {job.jobType && (
                        <Badge variant={job.jobType} className="text-sm">
                          {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReminderForm(true)}
                    className="text-muted-foreground hover:text-warning"
                    title="Set Reminder"
                  >
                    <Bell className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-muted-foreground hover:text-primary"
                    title="Edit Job"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Delete Job"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {job.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-foreground font-medium">{job.location}</p>
                    </div>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="text-foreground font-medium">{job.salary}</p>
                    </div>
                  </div>
                )}
                {job.appliedDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Applied Date</p>
                      <p className="text-foreground font-medium">
                        {format(new Date(job.appliedDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                {job.interviewDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-info mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Interview Date</p>
                      <p className="text-info font-medium">
                        {format(new Date(job.interviewDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                {job.jobUrl && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job URL</p>
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        {job.jobUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-secondary rounded-full text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(job.contactName || job.contactEmail) && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-4">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {job.contactName && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{job.contactName}</span>
                      </div>
                    )}
                    {job.contactEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${job.contactEmail}`} className="text-primary hover:underline">
                          {job.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {job.description && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>
              )}
            </div>

            <div className="glass rounded-xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Notes ({notes.length})
              </h2>

              <div className="flex gap-2 mb-4">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[80px] bg-secondary/50 border-border"
                />
              </div>
              <Button
                onClick={handleAddNote}
                disabled={addNoteMutation.isPending || !newNote.trim()}
                size="sm"
                className="mb-6"
              >
                {addNoteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Add Note
              </Button>

              <div className="space-y-3">
                {notes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No notes yet</p>
                ) : (
                  [...notes].reverse().map((note) => (
                    <div key={note._id} className="p-4 bg-secondary/30 rounded-lg group">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-foreground whitespace-pre-wrap flex-1">{note.text}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(note._id)}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {showReminderForm && (
              <div className="glass rounded-xl p-6 animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Bell className="w-5 h-5 text-warning" />
                    Set Reminder
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowReminderForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="bg-secondary/50"
                  />
                  <Input
                    placeholder="Optional note..."
                    value={reminderNote}
                    onChange={(e) => setReminderNote(e.target.value)}
                    className="bg-secondary/50"
                  />
                  <Button
                    onClick={handleSetReminder}
                    disabled={createReminderMutation.isPending || !reminderDate}
                    className="w-full"
                  >
                    {createReminderMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Bell className="w-4 h-4 mr-2" />
                    )}
                    Set Reminder
                  </Button>
                </div>
              </div>
            )}

            <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Timeline
              </h2>
              <div className="space-y-6">
                {timeline.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No timeline events</p>
                ) : (
                  timeline.map((event, index) => (
                    <div key={event._id} className="relative flex gap-4">
                      {index < timeline.length - 1 && (
                        <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
                      )}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pb-2">
                        <p className="font-medium text-foreground">{event.event}</p>
                        {event.description && (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <JobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateJob}
        job={job}
        isLoading={updateJobMutation.isPending}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        isLoading={deleteJobMutation.isPending}
      />
    </div>
  );
};

export default JobDetails;
