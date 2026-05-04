import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Application render error:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 text-center space-y-4 shadow-sm">
            <div className="mx-auto h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Something went wrong</h1>
              <p className="text-sm text-muted-foreground mt-1">
                We hit an unexpected dashboard error. Try reloading or go back home.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={this.handleRetry}>Try again</Button>
              <Button variant="outline" asChild>
                <a href="/">Back home</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
