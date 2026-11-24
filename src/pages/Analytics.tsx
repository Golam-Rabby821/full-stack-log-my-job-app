import { Loader2 } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Navbar } from '@/components/Navbar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAnalyticsOverview, useAnalyticsTrends } from '@/hooks/useAnalytics';

const Analytics = () => {
  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: trends, isLoading: trendsLoading } = useAnalyticsTrends();

  const isLoading = overviewLoading || trendsLoading;

  const statusDistribution = overview
    ? [
        { name: 'Pending', value: overview.byStatus.pending || 0, color: 'hsl(32, 82%, 48%)' },
        { name: 'Interview', value: overview.byStatus.interview || 0, color: 'hsl(217, 74%, 56%)' },
        { name: 'Offer', value: overview.byStatus.offer || 0, color: 'hsl(158, 56%, 42%)' },
        { name: 'Accepted', value: overview.byStatus.accepted || 0, color: 'hsl(173, 66%, 34%)' },
        { name: 'Declined', value: overview.byStatus.declined || 0, color: 'hsl(0, 62%, 52%)' },
      ].filter((item) => item.value > 0)
    : [];

  const jobTypeDistribution = overview
    ? [
        { name: 'Remote', value: overview.byJobType?.remote || 0, color: 'hsl(173, 66%, 38%)' },
        { name: 'Hybrid', value: overview.byJobType?.hybrid || 0, color: 'hsl(217, 74%, 56%)' },
        { name: 'Onsite', value: overview.byJobType?.onsite || 0, color: 'hsl(240, 5%, 45%)' },
      ].filter((item) => item.value > 0)
    : [];

  const total = overview?.totalJobs || 0;
  const reachedInterview =
    (overview?.byStatus.interview || 0) +
    (overview?.byStatus.offer || 0) +
    (overview?.byStatus.accepted || 0);
  const reachedOffer = (overview?.byStatus.offer || 0) + (overview?.byStatus.accepted || 0);
  const accepted = overview?.byStatus.accepted || 0;

  const funnelStages = [
    { label: 'Applied', count: total, pct: total ? 100 : 0, color: 'bg-foreground' },
    {
      label: 'Interview+',
      count: reachedInterview,
      pct: overview?.interviewRate ?? 0,
      color: 'bg-info',
    },
    {
      label: 'Offer+',
      count: reachedOffer,
      pct: overview?.offerRate ?? 0,
      color: 'bg-accent',
    },
    {
      label: 'Accepted',
      count: accepted,
      pct: overview?.acceptanceRate ?? overview?.successRate ?? 0,
      color: 'bg-success',
    },
  ];

  const kpiCards = [
    { label: 'Total', value: overview?.totalJobs || 0 },
    { label: 'Interview Rate', value: `${overview?.interviewRate ?? overview?.successRate ?? 0}%` },
    { label: 'Offer Rate', value: `${overview?.offerRate || 0}%` },
    { label: 'This Week', value: overview?.thisWeekCount ?? 0 },
    { label: 'Needs Follow-Up', value: overview?.staleCount ?? 0 },
  ];

  const chartConfig = {
    count: { label: 'Applications', color: 'hsl(173, 66%, 38%)' },
    pending: { label: 'Pending', color: 'hsl(32, 82%, 48%)' },
    interview: { label: 'Interview', color: 'hsl(217, 74%, 56%)' },
    offer: { label: 'Offer', color: 'hsl(158, 56%, 42%)' },
    accepted: { label: 'Accepted', color: 'hsl(173, 66%, 34%)' },
    declined: { label: 'Declined', color: 'hsl(0, 62%, 52%)' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-14">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Conversion funnel, velocity, and distribution across stages
          </p>
        </div>

        {/* Unified KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 rounded-xl border border-border bg-card divide-y sm:divide-y-0 sm:divide-x divide-border overflow-hidden mb-6">
          {kpiCards.map((item) => (
            <div key={item.label} className="px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-semibold font-mono tabular-nums text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Conversion Funnel */}
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Conversion Funnel</h2>
            <span className="font-mono text-xs text-muted-foreground">Stage progression</span>
          </div>
          <div className="grid sm:grid-cols-4 gap-5">
            {funnelStages.map((stage) => (
              <div key={stage.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{stage.label}</span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {stage.count} ({stage.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                    style={{ width: `${Math.min(Math.max(stage.pct, 0), 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-5">Weekly Trends (90 days)</h2>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart
                data={trends?.weekly || []}
                margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(173, 66%, 38%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(173, 66%, 38%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(173, 66%, 38%)"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-5">Status Distribution</h2>
            {statusDistribution.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <RechartsPieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={94}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    formatter={(value) => <span className="text-foreground text-xs">{value}</span>}
                  />
                </RechartsPieChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-5">
              Monthly Applications (12 months)
            </h2>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart
                data={trends?.monthly || []}
                margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={11} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(173, 66%, 38%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-5">Job Type Distribution</h2>
            {jobTypeDistribution.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <RechartsPieChart>
                  <Pie
                    data={jobTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={94}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {jobTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    formatter={(value) => <span className="text-foreground text-xs">{value}</span>}
                  />
                </RechartsPieChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
                No job type data
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
