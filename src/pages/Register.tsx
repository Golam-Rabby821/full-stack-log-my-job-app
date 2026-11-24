import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { registerSchema, RegisterFormValues } from '@/schemas/forms';
import { BrandMark } from '@/components/BrandMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await authApi.register(values);
      login(response.user, response.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background text-foreground">
      {/* Left Editorial Column */}
      <aside className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-secondary/45 border-r border-border">
        <Link to="/" aria-label="LogMyJobs Home">
          <BrandMark />
        </Link>

        <div className="space-y-6 max-w-md">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Get Started
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] leading-tight">
            Turn scattered applications into a{' '}
            <span className="font-serif italic font-normal">structured</span> pipeline.
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground pt-2">
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
              Drag-and-drop Kanban board & compact list ledger
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
              Automatic status timeline & follow-up reminders
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
              One-click CSV & PDF exports anytime
            </li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          Free personal workspace
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
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start tracking your applications in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium">
                Full Name
              </Label>
              <Input id="name" type="text" placeholder="Alex Rivera" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

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
                placeholder="Create a password"
                {...register('password')}
              />
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground underline underline-offset-4 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-xs text-muted-foreground text-center lg:text-left">
          Or try the <Link to="/login" className="underline underline-offset-4">live demo</Link> first
        </div>
      </main>
    </div>
  );
};

export default Register;
