import { Job, JobStatus } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit2, Trash2, Building2, ChevronRight, MapPin, Briefcase, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  index: number;
}

const getStatusVariant = (status: JobStatus): "pending" | "interview" | "declined" | "offer" | "accepted" => {
  return status;
};

const getStatusLabel = (status: JobStatus): string => {
  const labels: Record<JobStatus, string> = {
    pending: 'Pending',
    interview: 'Interview',
    declined: 'Declined',
    offer: 'Offer',
    accepted: 'Accepted',
  };
  return labels[status] || status;
};

export const JobCard = ({ job, onEdit, onDelete, index }: JobCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/job/${job._id}`);
  };

  return (
    <div
      className="group glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {job.position}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{job.company}</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(job.appliedDate || job.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {job.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{job.location}</span>
              </div>
            )}
            {job.jobType && (
              <Badge variant={job.jobType} className="text-[10px] px-2 py-0.5">
                {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
              </Badge>
            )}
            {job.priority && job.priority !== 'medium' && (
              <Badge variant={job.priority} className="text-[10px] px-2 py-0.5">
                <AlertCircle className="w-3 h-3 mr-1" />
                {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
              </Badge>
            )}
            <Badge variant={getStatusVariant(job.status)}>
              {getStatusLabel(job.status)}
            </Badge>
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {job.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">
                  {tag}
                </span>
              ))}
              {job.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{job.tags.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(job)}
              className="h-9 w-9 text-muted-foreground hover:text-primary"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(job._id)}
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </div>
  );
};
