import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { BrandMark } from '@/components/BrandMark';
import { CompanyAvatar } from '@/components/CompanyAvatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

type PreviewFilter = 'all' | 'interview' | 'offer' | 'pending';

interface PreviewRow {
  company: string;
  position: string;
  status: 'interview' | 'offer' | 'pending' | 'accepted';
  statusLabel: string;
  salary: string;
  location: string;
  updated: string;
}

const PREVIEW_ROWS: PreviewRow[] = [
  {
    company: 'Stripe',
    position: 'Senior Frontend Engineer',
    status: 'interview',
    statusLabel: 'Interview',
    salary: '$185k – $220k',
    location: 'San Francisco · Hybrid',
    updated: '2d ago',
  },
  {
    company: 'Vercel',
    position: 'Full Stack Engineer, DX',
    status: 'offer',
    statusLabel: 'Offer',
    salary: '$175k – $205k',
    location: 'Remote',
    updated: '5d ago',
  },
  {
    company: 'Linear',
    position: 'Product Engineer',
    status: 'interview',
    statusLabel: 'Interview',
    salary: '$180k – $210k',
    location: 'Remote',
    updated: '6d ago',
  },
  {
    company: 'Datadog',
    position: 'Software Engineer, APM UI',
    status: 'pending',
    statusLabel: 'Pending',
    salary: '$160k – $195k',
    location: 'New York · Hybrid',
    updated: '1d ago',
  },
  {
    company: 'Supabase',
    position: 'Frontend Engineer, Studio',
    status: 'interview',
    statusLabel: 'Interview',
    salary: '$155k – $185k',
    location: 'Remote',
    updated: '1w ago',
  },
  {
    company: 'Figma',
    position: 'Frontend Systems Engineer',
    status: 'pending',
    statusLabel: 'Pending',
    salary: '$190k – $225k',
    location: 'San Francisco · Onsite',
    updated: '3w ago',
  },
];

const STATUS_DOT: Record<PreviewRow['status'], string> = {
  interview: 'bg-info',
  offer: 'bg-success',
  pending: 'bg-warning',
  accepted: 'bg-success',
};

const FEATURES = [
  {
    index: '01',
    title: 'Ledger & Kanban views',
    description:
      'Switch cleanly between a high-density table for bulk edits and a five-stage pipeline board with optimistic drag-and-drop.',
  },
  {
    index: '02',
    title: 'True funnel telemetry',
    description:
      'Measure real stage conversion from applied to interview and offer, track weekly velocity, and surface stale applications.',
  },
  {
    index: '03',
    title: 'Follow-ups & clean exports',
    description:
      'Attach notes, timeline milestones, and dated reminders to each role, then export your full search history to CSV or PDF.',
  },
];

const Index = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [previewFilter, setPreviewFilter] = useState<PreviewFilter>('all');

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

  const filteredPreview =
    previewFilter === 'all'
      ? PREVIEW_ROWS
      : PREVIEW_ROWS.filter((row) => row.status === previewFilter);

  const filterTabs: { id: PreviewFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: PREVIEW_ROWS.length },
    {
      id: 'interview',
      label: 'Interview',
      count: PREVIEW_ROWS.filter((r) => r.status === 'interview').length,
    },
    {
      id: 'offer',
      label: 'Offer',
      count: PREVIEW_ROWS.filter((r) => r.status === 'offer').length,
    },
    {
      id: 'pending',
      label: 'Pending',
      count: PREVIEW_ROWS.filter((r) => r.status === 'pending').length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <header className="border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link to="/" aria-label="LogMyJobs Home">
            <BrandMark />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Button size="sm" onClick={handleTryDemo} disabled={isDemoLoading}>
              {isDemoLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Try live demo'
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Editorial Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 pt-16 pb-14 sm:pt-24 sm:pb-16">
            <div className="max-w-3xl animate-fade-in">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-5">
                Application tracker · Built for clarity
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.035em] leading-[1.08] text-foreground mb-6">
                Keep every application, interview, and offer in one{' '}
                <span className="font-serif italic font-normal text-[1.06em]">calm</span>{' '}
                workspace.
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
                A focused pipeline ledger with drag-and-drop stages, follow-up reminders, and
                real conversion telemetry — without the clutter of a spreadsheet.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="xl" onClick={handleTryDemo} disabled={isDemoLoading}>
                  {isDemoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Opening Demo...
                    </>
                  ) : (
                    <>
                      Try Live Demo
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <Link to="/register">
                  <Button variant="outline" size="xl">
                    Create Free Account
                  </Button>
                </Link>
                <span className="text-xs text-muted-foreground font-mono ml-1 hidden sm:inline">
                  No sign-up required for demo
                </span>
              </div>
            </div>

            {/* Interactive Product Preview Frame */}
            <div className="mt-14 rounded-xl border border-border bg-card shadow-[0_20px_50px_-28px_rgba(0,0,0,0.22)] overflow-hidden animate-slide-up">
              {/* Preview Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border bg-secondary/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                    <span className="w-2.5 h-2.5 rounded-full bg-border" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground pl-2 border-l border-border">
                    workspace / pipeline
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-background/70 border border-border rounded-lg p-0.5">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPreviewFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        previewFilter === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.label}
                      <span className="ml-1.5 font-mono text-[10px] opacity-75">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border border-b border-border bg-card">
                <div className="px-5 py-3.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Applications
                  </p>
                  <p className="text-xl font-semibold font-mono tabular-nums mt-0.5">18</p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Interview Rate
                  </p>
                  <p className="text-xl font-semibold font-mono tabular-nums mt-0.5">44%</p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Offer Rate
                  </p>
                  <p className="text-xl font-semibold font-mono tabular-nums mt-0.5">17%</p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Follow-ups Due
                  </p>
                  <p className="text-xl font-semibold font-mono tabular-nums mt-0.5">3</p>
                </div>
              </div>

              {/* Sample Ledger Rows */}
              <div className="divide-y divide-border">
                {filteredPreview.map((row) => (
                  <div
                    key={`${row.company}-${row.position}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-secondary/35 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyAvatar company={row.company} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {row.position}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {row.company} · {row.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 pl-11 sm:pl-0">
                      <span className="font-mono text-xs text-muted-foreground tabular-nums hidden md:inline">
                        {row.salary}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground min-w-[82px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                        {row.statusLabel}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums w-14 text-right">
                        {row.updated}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hairline-Divided Feature Ledger */}
        <section className="border-t border-b border-border bg-secondary/25">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {FEATURES.map((feature) => (
              <div key={feature.index} className="px-6 py-10">
                <p className="font-mono text-xs text-muted-foreground mb-3">{feature.index}</p>
                <h2 className="text-base font-semibold text-foreground tracking-tight mb-2">
                  {feature.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <BrandMark />
          <span className="text-border">|</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <span className="font-mono">TypeScript · React · TanStack Query · Express</span>
      </footer>
    </div>
  );
};

export default Index;
