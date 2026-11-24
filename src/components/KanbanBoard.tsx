import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Edit2, GripVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CompanyAvatar } from '@/components/CompanyAvatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job, JobStatus } from '@/types/job';

interface KanbanBoardProps {
  jobs: Job[];
  onStatusChange: (jobId: string, newStatus: JobStatus) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const COLUMNS: { status: JobStatus; label: string; dotClass: string }[] = [
  { status: 'pending', label: 'Pending', dotClass: 'bg-warning' },
  { status: 'interview', label: 'Interview', dotClass: 'bg-info' },
  { status: 'offer', label: 'Offer', dotClass: 'bg-success' },
  { status: 'accepted', label: 'Accepted', dotClass: 'bg-success' },
  { status: 'declined', label: 'Declined', dotClass: 'bg-destructive' },
];

interface KanbanCardContentProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
}

const KanbanCardContent = ({ job, onEdit, onDelete, isDragging }: KanbanCardContentProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-card rounded-lg p-3.5 border border-border transition-all ${
        isDragging ? 'shadow-xl ring-1 ring-foreground/20' : 'hover:border-foreground/25'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <button
          type="button"
          onClick={() => navigate(`/job/${job._id}`)}
          className="text-left flex items-start gap-2.5 flex-1 min-w-0 group"
        >
          <CompanyAvatar company={job.company} className="w-7 h-7 text-[10px] mt-0.5" />
          <div className="min-w-0">
            <p className="font-medium text-sm text-foreground truncate group-hover:underline underline-offset-4">
              {job.position}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{job.company}</p>
          </div>
        </button>
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-1" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        {job.jobType && (
          <Badge variant={job.jobType} className="text-[10px] px-1.5 py-0">
            {job.jobType}
          </Badge>
        )}
        {job.priority && job.priority !== 'medium' && (
          <Badge variant={job.priority} className="text-[10px] px-1.5 py-0">
            {job.priority}
          </Badge>
        )}
        {job.salary && (
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {job.salary}
          </span>
        )}
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {job.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {format(new Date(job.appliedDate || job.createdAt), 'MMM d')}
        </span>
        {onEdit && onDelete && (
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${job.position}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job);
              }}
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete ${job.position}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job._id);
              }}
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface DraggableKanbanCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const DraggableKanbanCard = ({ job, onEdit, onDelete }: DraggableKanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job._id,
    data: { status: job.status },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing touch-none ${isDragging ? 'opacity-40' : ''}`}
    >
      <KanbanCardContent job={job} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

interface DroppableColumnProps {
  status: JobStatus;
  label: string;
  dotClass: string;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const DroppableColumn = ({
  status,
  label,
  dotClass,
  jobs,
  onEdit,
  onDelete,
}: DroppableColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      data-testid={`kanban-column-${status}`}
      className={`rounded-xl bg-secondary/45 border border-border/80 p-2.5 flex flex-col min-h-[460px] transition-colors ${
        isOver ? 'ring-1 ring-foreground/30 bg-secondary/80' : ''
      }`}
    >
      <div className="flex items-center justify-between px-1.5 py-1.5 mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotClass}`} />
          <h3 className="font-medium text-xs text-foreground">{label}</h3>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums px-1.5 py-0.5 rounded bg-background/70 border border-border/70">
          {jobs.length}
        </span>
      </div>

      <div className="space-y-2 flex-1">
        {jobs.length === 0 ? (
          <div className="h-24 rounded-lg border border-dashed border-border flex items-center justify-center text-[11px] text-muted-foreground">
            Drop here
          </div>
        ) : (
          jobs.map((job) => (
            <DraggableKanbanCard key={job._id} job={job} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export const KanbanBoard = ({ jobs, onStatusChange, onEdit, onDelete }: KanbanBoardProps) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const found = jobs.find((j) => j._id === String(event.active.id));
    setActiveJob(found || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null);
    const { active, over } = event;
    if (!over) return;

    const jobId = String(active.id);
    const targetStatus = String(over.id) as JobStatus;
    const currentJob = jobs.find((j) => j._id === jobId);

    if (currentJob && currentJob.status !== targetStatus) {
      onStatusChange(jobId, targetStatus);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {COLUMNS.map((col) => (
          <DroppableColumn
            key={col.status}
            status={col.status}
            label={col.label}
            dotClass={col.dotClass}
            jobs={jobs.filter((job) => job.status === col.status)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob ? <KanbanCardContent job={activeJob} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};
