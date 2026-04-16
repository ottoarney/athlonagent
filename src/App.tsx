import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import DashboardHome from './pages/DashboardHome';
import AthleteDashboard from './pages/AthleteDashboard';
import Athletes from './pages/Athletes';
import Tasks from './pages/Tasks';
import Deals from './pages/Deals';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Settings from './pages/Settings';
import RoleSelect from './pages/RoleSelect';
import AuthPortal from './pages/AuthPortal';
import AuthCallback from './pages/AuthCallback';
import RoleOnboarding from './pages/RoleOnboarding';
import Demo from './pages/Demo';
import Waitlist from './pages/Waitlist';
import Conversations from './pages/Conversations';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<RoleSelect />} />
          <Route path="/signup/:role" element={<AuthPortal />} />
          <Route path="/login/:role" element={<AuthPortal />} />
          <Route path="/:mode/:role" element={<AuthPortal />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/onboarding/role" element={<RoleOnboarding />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/waitlist" element={<Waitlist />} />

          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/athlete-dashboard" element={<AthleteDashboard />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
