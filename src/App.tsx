import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import DashboardHome from './pages/DashboardHome';
import Athletes from './pages/Athletes';
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

              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/athletes" element={<Athletes />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/content" element={<Content />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/settings" element={<Settings />} />
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
