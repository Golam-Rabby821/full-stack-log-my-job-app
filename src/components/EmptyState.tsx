import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddJob: () => void;
}

export const EmptyState = ({ onAddJob }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6">
        <Briefcase className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No jobs tracked yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Start tracking your job applications to stay organized and on top of your career journey.
      </p>
      <Button variant="glow" onClick={onAddJob}>
        Add Your First Job
      </Button>
    </div>
  );
};
