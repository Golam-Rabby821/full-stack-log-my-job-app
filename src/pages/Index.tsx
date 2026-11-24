import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Briefcase, ArrowRight, CheckCircle2, Shield, Zap, Sparkles, Loader2 } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'Pipeline & Kanban Board',
    description: 'Track applications across stages with drag-and-drop updates and timeline history',
  },
  {
    icon: Shield,
    title: 'Insights & Analytics',
    description: 'Monitor interview conversion rates, stale follow-ups, and weekly search velocity',
  },
  {
    icon: Zap,
    title: 'Reminders & Exports',
    description: 'Schedule follow-up reminders and export your search history to CSV or PDF anytime',
  },
];

const Index = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleTryDemo = async () => {
    setIsDemoLoading(true);
    try {
      const response = await authApi.demoLogin();
      login(response.user, response.token);
      toast.success('Signed into live demo workspace');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start demo');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <img src="/logo-icon.svg" alt="Logo" className="w-12 h-12" />
          <span className="font-bold text-xl tracking-tight">
            Log<span className="text-primary">My</span>Jobs
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="glow">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <CheckCircle2 className="w-4 h-4" />
            Your job search, simplified
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Track your job applications{' '}
            <span className="gradient-text">effortlessly</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Stay organized with a drag-and-drop pipeline, follow-up reminders, and conversion
            analytics — built to help you land your next role.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="glow"
              size="xl"
              onClick={handleTryDemo}
              disabled={isDemoLoading}
            >
              {isDemoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading Demo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Try Live Demo
                </>
              )}
            </Button>
            <Link to="/register">
              <Button variant="outline" size="xl">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto w-full">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 text-left animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} LogMyJobs. Built with TypeScript, React & Express.
      </footer>
    </div>
  );
};

export default Index;
