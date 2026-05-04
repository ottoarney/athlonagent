import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';

interface DashboardErrorBoundaryProps {
  children: ReactNode;
}

interface DashboardErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class DashboardErrorBoundary extends Component<DashboardErrorBoundaryProps, DashboardErrorBoundaryState> {
  state: DashboardErrorBoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('Dashboard render error:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <AppLayout>
          <div className="mx-auto w-full max-w-2xl py-10">
            <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold">Dashboard failed to load</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Something went wrong while loading this dashboard view. Try again.
              </p>
              {import.meta.env.DEV && this.state.errorMessage && (
                <pre className="mt-4 overflow-auto rounded-lg border border-border bg-surface p-3 text-xs text-destructive">
                  {this.state.errorMessage}
                </pre>
              )}
              <div className="mt-5">
                <Button onClick={this.handleRetry}>Try again</Button>
              </div>
            </div>
          </div>
        </AppLayout>
      );
    }

    return this.props.children;
  }
}
