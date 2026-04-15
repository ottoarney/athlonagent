import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import DashboardHome from './pages/DashboardHome';
import Athletes from './pages/Athletes';
import Tasks from './pages/Tasks';
import Deals from './pages/Deals';
import Calendar from './pages/Calendar';
import Content from './pages/Content';
import Settings from './pages/Settings';
import RoleSelect from './pages/RoleSelect';
import AuthPortal from './pages/AuthPortal';
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
          <Route path="/:mode/:role" element={<AuthPortal />} />

          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/athletes" element={<Athletes />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/content" element={<Content />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
