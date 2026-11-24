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
import { Building2, Calendar, Edit2, GripVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job, JobStatus } from '@/types/job';

interface KanbanBoardProps {
  jobs: Job[];
  onStatusChange: (jobId: string, newStatus: JobStatus) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const COLUMNS: { status: JobStatus; label: string; accentClass: string }[] = [
  { status: 'pending', label: 'Pending', accentClass: 'border-t-warning' },
  { status: 'interview', label: 'Interview', accentClass: 'border-t-info' },
  { status: 'offer', label: 'Offer', accentClass: 'border-t-success' },
  { status: 'accepted', label: 'Accepted', accentClass: 'border-t-success' },
  { status: 'declined', label: 'Declined', accentClass: 'border-t-destructive' },
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
      className={`glass rounded-lg p-3.5 border border-border/60 transition-all ${
        isDragging ? 'shadow-2xl ring-2 ring-primary/50 rotate-1' : 'hover:border-primary/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <button
          type="button"
          onClick={() => navigate(`/job/${job._id}`)}
          className="text-left flex-1 min-w-0 group"
        >
          <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {job.position}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
            <Building2 className="w-3 h-3 shrink-0" />
            {job.company}
          </p>
        </button>
        <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
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
          <span className="text-[10px] text-muted-foreground font-medium">{job.salary}</span>
        )}
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {job.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {format(new Date(job.appliedDate || job.createdAt), 'MMM d')}
        </span>
        {onEdit && onDelete && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${job.position}`}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job);
              }}
              className="h-6 w-6 text-muted-foreground hover:text-primary"
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
  accentClass: string;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const DroppableColumn = ({
  status,
  label,
  accentClass,
  jobs,
  onEdit,
  onDelete,
}: DroppableColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      data-testid={`kanban-column-${status}`}
      className={`glass rounded-xl p-3 border-t-4 ${accentClass} flex flex-col min-h-[420px] transition-colors ${
        isOver ? 'ring-2 ring-primary/50 bg-primary/5' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-sm text-foreground">{label}</h3>
        <Badge variant={status} className="text-xs px-2 py-0.5">
          {jobs.length}
        </Badge>
      </div>

      <div className="space-y-2.5 flex-1">
        {jobs.length === 0 ? (
          <div className="h-24 rounded-lg border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">
            Drop job here
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => (
          <DroppableColumn
            key={col.status}
            status={col.status}
            label={col.label}
            accentClass={col.accentClass}
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
