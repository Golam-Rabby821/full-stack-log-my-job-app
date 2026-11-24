import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddJob: () => void;
}

export const EmptyState = ({ onAddJob }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-border bg-card">
      <div className="flex items-center justify-center w-11 h-11 rounded-lg border border-border bg-secondary text-foreground mb-4">
        <Briefcase className="w-5 h-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">No jobs tracked yet</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-sm">
        Add your first application to start tracking stages, notes, and follow-up reminders.
      </p>
      <Button onClick={onAddJob}>Add Your First Job</Button>
    </div>
  );
};
