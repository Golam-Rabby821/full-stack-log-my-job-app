import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueryErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const QueryErrorState = ({
  title = 'Could not load data',
  message = 'Something went wrong while communicating with the server. Please try again.',
  onRetry,
}: QueryErrorStateProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-10 text-center">
      <div className="mx-auto w-10 h-10 rounded-lg border border-destructive/25 bg-destructive/10 text-destructive flex items-center justify-center mb-3.5">
        <AlertCircle className="w-4 h-4" />
      </div>
      <h2 className="text-base font-semibold text-foreground mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Try Again
        </Button>
      )}
    </div>
  );
};
