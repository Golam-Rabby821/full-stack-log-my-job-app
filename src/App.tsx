import { ComponentType, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CommandPalette } from '@/components/CommandPalette';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const lazyWithRetry = <T extends ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>,
  key: string
) =>
  lazy(async () => {
    const storageKey = `lazy_retry_${key}`;
    try {
      const mod = await importer();
      sessionStorage.removeItem(storageKey);
      return mod;
    } catch (error) {
      const alreadyRetried = sessionStorage.getItem(storageKey) === '1';
      if (!alreadyRetried) {
        sessionStorage.setItem(storageKey, '1');
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      sessionStorage.removeItem(storageKey);
      throw error;
    }
  });

const JobDetails = lazyWithRetry(() => import('./pages/JobDetails'), 'job-details');
const Analytics = lazyWithRetry(() => import('./pages/Analytics'), 'analytics');
const Profile = lazyWithRetry(() => import('./pages/Profile'), 'profile');
const Reminders = lazyWithRetry(() => import('./pages/Reminders'), 'reminders');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Sonner position="top-right" richColors />
            <BrowserRouter>
              <CommandPalette />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/job/:id" element={<JobDetails />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reminders" element={<Reminders />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
