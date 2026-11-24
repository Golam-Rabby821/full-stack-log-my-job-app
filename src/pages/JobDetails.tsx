import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Bell,
  Calendar,
  DollarSign,
  Edit2,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Send,
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
import { CompanyAvatar } from '@/components/CompanyAvatar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { JobModal } from '@/components/JobModal';
import { Navbar } from '@/components/Navbar';
import { QueryErrorState } from '@/components/QueryErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const STATUS_DOT: Record<JobStatus, string> = {
  pending: 'bg-warning',
  interview: 'bg-info',
  offer: 'bg-success',
  accepted: 'bg-success',
  declined: 'bg-destructive',
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: jobData, isLoading, isError, error, refetch } = useJob(id);
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

  const job = jobData?.job;
  const notes = notesData?.notes ?? job?.notes ?? [];
  const timeline = timelineData?.timeline ?? job?.timeline ?? [];

  const handleUpdateJob = async (data: CreateJobData) => {
    if (!job) return;
    try {
      await updateJobMutation.mutateAsync({ id: job._id, data });
      setIsEditModalOpen(false);
      toast.success('Job updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update job');
      throw err;
    }
  };

  const handleDeleteJob = async () => {
    if (!job) return;
    try {
      await deleteJobMutation.mutateAsync(job._id);
      toast.success('Job deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete job');
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-14">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mb-5 -ml-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Pipeline
          </Button>
          <QueryErrorState
            title={isError ? 'Unable to load application' : 'Application not found'}
            message={
              error instanceof Error
                ? error.message
                : 'This application may have been deleted or the link is invalid.'
            }
            onRetry={isError ? () => void refetch() : undefined}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-14">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mb-5 -ml-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Pipeline
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <CompanyAvatar company={job.company} className="w-11 h-11 text-sm" />
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                      {job.position}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-3">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={job.status}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[job.status]}`} />
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                      {job.priority && job.priority !== 'medium' && (
                        <Badge variant={job.priority}>
                          {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)} Priority
                        </Badge>
                      )}
                      {job.jobType && (
                        <Badge variant={job.jobType}>
                          {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReminderForm((prev) => !prev)}
                    className="h-8 text-xs"
                  >
                    <Bell className="w-3.5 h-3.5 mr-1.5" />
                    Remind
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Edit Job"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-5">Details</h2>
              <div className="grid sm:grid-cols-2 gap-5 text-sm">
                {job.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-foreground font-medium mt-0.5">{job.location}</p>
                    </div>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Compensation</p>
                      <p className="font-mono text-foreground font-medium mt-0.5">{job.salary}</p>
                    </div>
                  </div>
                )}
                {job.appliedDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Applied Date</p>
                      <p className="font-mono text-foreground font-medium mt-0.5">
                        {format(new Date(job.appliedDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                {job.interviewDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-info mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Interview Date</p>
                      <p className="font-mono text-info font-medium mt-0.5">
                        {format(new Date(job.interviewDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                {job.jobUrl && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Posting URL</p>
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline underline-offset-4 hover:text-muted-foreground font-medium break-all"
                      >
                        {job.jobUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2.5">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2.5 py-0.5 bg-secondary rounded-md text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(job.contactName || job.contactEmail) && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Contact</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {job.contactName && (
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{job.contactName}</span>
                      </div>
                    )}
                    {job.contactEmail && (
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`mailto:${job.contactEmail}`}
                          className="text-foreground underline underline-offset-4"
                        >
                          {job.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {job.description && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Description</p>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </p>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Notes <span className="font-mono text-muted-foreground">({notes.length})</span>
              </h2>

              <div className="space-y-3 mb-5">
                <Textarea
                  placeholder="Write an interview note, recruiter feedback, or prep checklist..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[84px] bg-background"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={addNoteMutation.isPending || !newNote.trim()}
                  size="sm"
                >
                  {addNoteMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Add Note
                </Button>
              </div>

              <div className="divide-y divide-border border-t border-border">
                {notes.length === 0 ? (
                  <p className="text-muted-foreground text-xs pt-4">No notes yet</p>
                ) : (
                  [...notes].reverse().map((note) => (
                    <div key={note._id} className="py-3.5 group">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-foreground whitespace-pre-wrap flex-1">
                          {note.text}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(note._id)}
                          className="opacity-0 group-hover:opacity-100 h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground mt-1.5">
                        {format(new Date(note.createdAt), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {showReminderForm && (
              <div className="rounded-xl border border-border bg-card p-5 animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground">Set Reminder</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowReminderForm(false)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="bg-background"
                  />
                  <Input
                    placeholder="Optional note..."
                    value={reminderNote}
                    onChange={(e) => setReminderNote(e.target.value)}
                    className="bg-background"
                  />
                  <Button
                    onClick={handleSetReminder}
                    disabled={createReminderMutation.isPending || !reminderDate}
                    className="w-full"
                    size="sm"
                  >
                    {createReminderMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Bell className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Save Reminder
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-5">Timeline</h2>
              <div className="space-y-5">
                {timeline.length === 0 ? (
                  <p className="text-muted-foreground text-xs">No timeline events</p>
                ) : (
                  timeline.map((event, index) => (
                    <div key={event._id} className="relative flex gap-3.5">
                      {index < timeline.length - 1 && (
                        <div className="absolute left-[7px] top-4 bottom-[-20px] w-px bg-border" />
                      )}
                      <div className="mt-1.5 w-3.5 h-3.5 rounded-full border-2 border-foreground bg-background shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{event.event}</p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {event.description}
                          </p>
                        )}
                        <p className="font-mono text-[11px] text-muted-foreground mt-1">
                          {format(new Date(event.date), 'MMM d, yyyy · h:mm a')}
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
