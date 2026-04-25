import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import DashboardOverview from './pages/DashboardOverview';
import Athletes from './pages/Athletes';
import Team from './pages/Team';
import Tasks from './pages/Tasks';
import Deals from './pages/Deals';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Settings from './pages/Settings';
import AuthPortal from './pages/AuthPortal';
import AuthCallback from './pages/AuthCallback';
import Demo from './pages/Demo';
import Waitlist from './pages/Waitlist';
import Conversations from './pages/Conversations';
import NotFound from './pages/NotFound';
import { AppErrorBoundary } from './components/app/AppErrorBoundary';

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div className="rounded-xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">Loading dashboard…</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<AuthPortal />} />
              <Route path="/login" element={<AuthPortal />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/waitlist" element={<Waitlist />} />

              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/dashboard/calendar" element={<Calendar />} />
              <Route path="/dashboard/tasks" element={<Tasks />} />
              <Route path="/dashboard/athletes" element={<Athletes />} />
              <Route path="/dashboard/team" element={<Team />} />
              <Route path="/dashboard/deals" element={<Deals />} />
              <Route path="/dashboard/content" element={<Content />} />
              <Route path="/dashboard/conversations" element={<Conversations />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/files" element={<Navigate to="/dashboard" replace />} />

              <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
              <Route path="/tasks" element={<Navigate to="/dashboard/tasks" replace />} />
              <Route path="/athletes" element={<Navigate to="/dashboard/athletes" replace />} />
              <Route path="/team" element={<Navigate to="/dashboard/team" replace />} />
              <Route path="/deals" element={<Navigate to="/dashboard/deals" replace />} />
              <Route path="/content" element={<Navigate to="/dashboard/content" replace />} />
              <Route path="/conversations" element={<Navigate to="/dashboard/conversations" replace />} />
              <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
              <Route path="/files" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </AppErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
