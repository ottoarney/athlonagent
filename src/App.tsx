import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import DashboardOverview from './pages/DashboardOverview';
import Athletes from './pages/Athletes';
import Tasks from './pages/Tasks';
import Deals from './pages/Deals';
import CampaignDetail from './pages/CampaignDetail';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Settings from './pages/Settings';
import Team from './pages/Team';
import AuthPortal from './pages/AuthPortal';
import AuthCallback from './pages/AuthCallback';
import Demo from './pages/Demo';
import Waitlist from './pages/Waitlist';
import Conversations from './pages/Conversations';
import NotFound from './pages/NotFound';
import { AppErrorBoundary } from './components/app/AppErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div className="rounded-xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">Loading dashboard…</div>
  </div>
);


const HashScrollManager = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const targetId = hash.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash, pathname]);

  return null;
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <BrowserRouter>
            <HashScrollManager />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<AuthPortal />} />
              <Route path="/login" element={<AuthPortal />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/waitlist" element={<Waitlist />} />

              <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
              <Route path="/dashboard/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/dashboard/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/dashboard/athletes" element={<ProtectedRoute><Athletes /></ProtectedRoute>} />
              <Route path="/dashboard/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/dashboard/campaigns" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
              <Route path="/dashboard/campaigns/:campaignId" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
              <Route path="/dashboard/deals" element={<ProtectedRoute><Navigate to="/dashboard/campaigns" replace /></ProtectedRoute>} />
              <Route path="/dashboard/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
              <Route path="/dashboard/conversations" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
              <Route path="/dashboard/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/dashboard/files" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />

              <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
              <Route path="/tasks" element={<Navigate to="/dashboard/tasks" replace />} />
              <Route path="/athletes" element={<Navigate to="/dashboard/athletes" replace />} />
              <Route path="/deals" element={<Navigate to="/dashboard/campaigns" replace />} />
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
