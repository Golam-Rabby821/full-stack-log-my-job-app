import React from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const isChunkLoadError = (error: Error | null): boolean => {
  if (!error) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes('dynamically imported module') ||
    msg.includes('loading chunk') ||
    msg.includes('failed to fetch')
  );
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const chunkError = isChunkLoadError(this.state.error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="rounded-xl border border-border bg-card p-8 max-w-md w-full text-center shadow-sm">
            <div className="mx-auto w-11 h-11 rounded-lg border border-destructive/25 bg-destructive/10 text-destructive flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground mb-1.5">
              {chunkError ? 'A newer version is available' : 'Something went wrong'}
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {chunkError
                ? 'This page was updated or temporarily interrupted while loading. Reload to fetch the latest bundle.'
                : this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button onClick={this.handleReload} className="flex-1">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reload Page
              </Button>
              <Button variant="outline" onClick={this.handleHome} className="flex-1">
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
