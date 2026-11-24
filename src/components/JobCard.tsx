import { Job, JobStatus } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CompanyAvatar } from '@/components/CompanyAvatar';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  index: number;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const STATUS_DOT: Record<JobStatus, string> = {
  pending: 'bg-warning',
  interview: 'bg-info',
  offer: 'bg-success',
  accepted: 'bg-success',
  declined: 'bg-destructive',
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

export const JobCard = ({
  job,
  onEdit,
  onDelete,
  selected,
  onToggleSelect,
}: JobCardProps) => {
  const navigate = useNavigate();

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="checkbox"]')) return;
    navigate(`/job/${job._id}`);
  };

  return (
    <div
      onClick={handleRowClick}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 hover:bg-secondary/35 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {onToggleSelect && (
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(job._id)}
            aria-label={`Select ${job.position} at ${job.company}`}
            className="shrink-0"
          />
        )}

        <CompanyAvatar company={job.company} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground truncate group-hover:underline underline-offset-4">
              {job.position}
            </h3>
            {job.priority === 'high' && (
              <Badge variant="high" className="text-[10px] px-1.5 py-0">
                High
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
            <span className="font-medium text-foreground/80">{job.company}</span>
            {job.location && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[160px]">{job.location}</span>
              </>
            )}
            {job.jobType && (
              <>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{job.jobType}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 pl-10 sm:pl-0 shrink-0">
        {job.tags && job.tags.length > 0 && (
          <div className="hidden xl:flex items-center gap-1">
            {job.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 bg-secondary rounded text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {job.salary && (
          <span className="hidden md:inline font-mono text-xs text-muted-foreground tabular-nums">
            {job.salary}
          </span>
        )}

        <Badge variant={job.status} className="min-w-[88px] justify-start">
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[job.status]}`} />
          {getStatusLabel(job.status)}
        </Badge>

        <span className="font-mono text-xs text-muted-foreground tabular-nums w-20 text-right hidden sm:inline">
          {format(new Date(job.appliedDate || job.createdAt), 'MMM d, yy')}
        </span>

        <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${job.position}`}
            onClick={() => onEdit(job)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${job.position}`}
            onClick={() => onDelete(job._id)}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
