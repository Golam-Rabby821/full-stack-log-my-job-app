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
import { Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CompanyAvatar } from '@/components/CompanyAvatar';
import { Job, JobStatus } from '@/types/job';
import { Button } from '@/components/ui/button';

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
  const meta = [job.salary, job.jobType].filter(Boolean);

  return (
    <div
      className={`group bg-card rounded-lg p-3.5 border border-border transition-all ${
        isDragging ? 'shadow-xl ring-1 ring-foreground/20' : 'hover:border-foreground/25'
      }`}
    >
      <div className="flex items-start gap-2.5 mb-2">
        <CompanyAvatar company={job.company} className="w-7 h-7 text-[10px] mt-0.5" />
        <button
          type="button"
          onClick={() => navigate(`/job/${job._id}`)}
          className="text-left flex-1 min-w-0"
        >
          <p className="font-medium text-xs leading-snug text-foreground line-clamp-2 group-hover:underline underline-offset-4">
            {job.position}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-muted-foreground truncate">{job.company}</span>
            {job.priority === 'high' && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0"
                title="High priority"
              />
            )}
          </div>
        </button>
      </div>

      {meta.length > 0 && (
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums truncate mb-2">
          {meta.join(' · ')}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {format(new Date(job.appliedDate || job.createdAt), 'MMM d')}
        </span>
        {onEdit && onDelete && (
          <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
      className={`rounded-xl bg-secondary/45 border border-border/80 p-2.5 flex flex-col min-h-[440px] transition-colors ${
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
