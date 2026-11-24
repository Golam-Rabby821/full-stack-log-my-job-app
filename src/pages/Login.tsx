import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { loginSchema, LoginFormValues } from '@/schemas/forms';
import { BrandMark } from '@/components/BrandMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SAMPLE_ACTIVITY = [
  { company: 'Stripe', role: 'Senior Frontend Engineer', stage: 'Interview', dot: 'bg-info', time: '2d' },
  { company: 'Vercel', role: 'Full Stack Engineer, DX', stage: 'Offer', dot: 'bg-success', time: '5d' },
  { company: 'Linear', role: 'Product Engineer', stage: 'Interview', dot: 'bg-info', time: '6d' },
];

const Login = () => {
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await authApi.login(values);
      login(response.user, response.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const response = await authApi.demoLogin();
      login(response.user, response.token);
      toast.success('Entered live demo workspace');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Demo login failed');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background text-foreground">
      {/* Left Editorial Column */}
      <aside className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-secondary/45 border-r border-border">
        <Link to="/" aria-label="LogMyJobs Home">
          <BrandMark />
        </Link>

        <div className="space-y-8 max-w-md">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
              Search Workspace
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] leading-tight">
              A quieter way to run a{' '}
              <span className="font-serif italic font-normal">serious</span> job search.
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {SAMPLE_ACTIVITY.map((item) => (
              <div
                key={item.company}
                className="px-4 py-3 flex items-center justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{item.role}</p>
                  <p className="text-xs text-muted-foreground">{item.company}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                    {item.stage}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          Pipeline · Timeline · Funnel Analytics
        </p>
      </aside>

      {/* Right Form Column */}
      <main className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm mx-auto my-auto py-12 animate-fade-in">
          <div className="lg:hidden mb-8">
            <BrandMark />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1.5">
              Sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to open your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              disabled={isSubmitting || isDemoLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[11px] font-mono uppercase tracking-wider">
              <span className="bg-background px-2.5 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleDemoLogin}
            disabled={isSubmitting || isDemoLoading}
          >
            {isDemoLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading Demo...
              </>
            ) : (
              'Explore with Live Demo'
            )}
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-foreground underline underline-offset-4 font-medium">
              Create one
            </Link>
          </p>
        </div>

        <div className="text-xs text-muted-foreground text-center lg:text-left">
          Protected with JWT authentication
        </div>
      </main>
    </div>
  );
};

export default Login;
