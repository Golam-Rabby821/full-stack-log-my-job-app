import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Bell, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BrandMark } from '@/components/BrandMark';
import { Navbar } from '@/components/Navbar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {isAuthenticated ? (
        <Navbar />
      ) : (
        <header className="border-b border-border bg-background/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link to="/" aria-label="LogMyJobs Home">
              <BrandMark />
            </Link>
            <ThemeToggle />
          </div>
        </header>
      )}

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-8 sm:p-10 max-w-md w-full text-center shadow-sm">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
            Error 404
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            We couldn't find that page
          </h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            The route{' '}
            <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">
              {location.pathname}
            </code>{' '}
            doesn't exist or may have moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
            <Button asChild className="flex-1">
              <Link to={isAuthenticated ? '/dashboard' : '/'}>
                {isAuthenticated ? (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                    Go to Pipeline
                  </>
                ) : (
                  <>
                    <Home className="w-3.5 h-3.5 mr-1.5" />
                    Go to Home
                  </>
                )}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Go Back
            </Button>
          </div>

          {isAuthenticated && (
            <div className="pt-5 border-t border-border flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-3 h-3" />
                Pipeline
              </Link>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <BarChart3 className="w-3 h-3" />
                Analytics
              </Link>
              <Link
                to="/reminders"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Bell className="w-3 h-3" />
                Reminders
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotFound;
