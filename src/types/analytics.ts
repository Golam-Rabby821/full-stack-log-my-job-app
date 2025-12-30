import { JobStatus, JobType } from './job';

export interface AnalyticsOverview {
  totalJobs: number;
  byStatus: Record<JobStatus, number>;
  byJobType: Record<JobType, number>;
  successRate: number;
  offerRate: number;
}

export interface TrendDataPoint {
  label: string;
  count: number;
}

export interface AnalyticsTrends {
  weekly: TrendDataPoint[];
  monthly: TrendDataPoint[];
}

export interface AnalyticsMonthly {
  monthly: TrendDataPoint[];
}
