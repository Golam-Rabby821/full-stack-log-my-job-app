import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  Calendar,
  Filter,
  Gift,
  Loader2,
  MapPin,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
        { name: 'Pending', value: overview.byStatus.pending || 0, color: 'hsl(38, 92%, 50%)' },
        { name: 'Interview', value: overview.byStatus.interview || 0, color: 'hsl(199, 89%, 48%)' },
        { name: 'Offer', value: overview.byStatus.offer || 0, color: 'hsl(142, 76%, 46%)' },
        { name: 'Accepted', value: overview.byStatus.accepted || 0, color: 'hsl(142, 76%, 36%)' },
        { name: 'Declined', value: overview.byStatus.declined || 0, color: 'hsl(0, 72%, 51%)' },
      ].filter((item) => item.value > 0)
    : [];

  const jobTypeDistribution = overview
    ? [
        { name: 'Remote', value: overview.byJobType?.remote || 0, color: 'hsl(199, 89%, 48%)' },
        { name: 'Hybrid', value: overview.byJobType?.hybrid || 0, color: 'hsl(210, 100%, 56%)' },
        { name: 'Onsite', value: overview.byJobType?.onsite || 0, color: 'hsl(220, 14%, 40%)' },
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
    { label: 'Applied', count: total, pct: total ? 100 : 0, color: 'bg-primary' },
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
      color: 'bg-success',
    },
    {
      label: 'Accepted',
      count: accepted,
      pct: overview?.acceptanceRate ?? overview?.successRate ?? 0,
      color: 'bg-emerald-500',
    },
  ];

  const chartConfig = {
    count: { label: 'Applications', color: 'hsl(210, 100%, 56%)' },
    pending: { label: 'Pending', color: 'hsl(38, 92%, 50%)' },
    interview: { label: 'Interview', color: 'hsl(199, 89%, 48%)' },
    offer: { label: 'Offer', color: 'hsl(142, 76%, 46%)' },
    accepted: { label: 'Accepted', color: 'hsl(142, 76%, 36%)' },
    declined: { label: 'Declined', color: 'hsl(0, 72%, 51%)' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your job search conversion funnel and trends</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="glass rounded-xl p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{overview?.totalJobs || 0}</p>
          </div>

          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-info/10">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <span className="text-sm text-muted-foreground">Interview Rate</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {overview?.interviewRate ?? overview?.successRate ?? 0}%
            </p>
          </div>

          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <Gift className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Offer Rate</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{overview?.offerRate || 0}%</p>
          </div>

          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{overview?.thisWeekCount ?? 0}</p>
          </div>

          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Needs Follow-Up</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{overview?.staleCount ?? 0}</p>
          </div>
        </div>

        <div className="glass rounded-xl p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.22s' }}>
          <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Conversion Funnel
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {funnelStages.map((stage) => (
              <div key={stage.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{stage.label}</span>
                  <span className="text-muted-foreground">
                    {stage.count} ({stage.pct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                    style={{ width: `${Math.min(Math.max(stage.pct, 0), 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Trends (90 days)
            </h2>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                data={trends?.weekly || []}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(210, 100%, 56%)"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Status Distribution
            </h2>
            {statusDistribution.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsPieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                  />
                </RechartsPieChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Monthly Applications (12 months)
            </h2>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                data={trends?.monthly || []}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(210, 100%, 56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Job Type Distribution
            </h2>
            {jobTypeDistribution.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsPieChart>
                  <Pie
                    data={jobTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {jobTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                  />
                </RechartsPieChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
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
