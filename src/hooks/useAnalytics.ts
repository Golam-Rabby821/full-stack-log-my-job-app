import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
  trends: () => [...analyticsKeys.all, 'trends'] as const,
};

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: analyticsApi.getOverview,
  });

export const useAnalyticsTrends = () =>
  useQuery({
    queryKey: analyticsKeys.trends(),
    queryFn: analyticsApi.getTrends,
  });

export const useInvalidateAnalytics = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
};
