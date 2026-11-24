import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobsApi, notesApi, timelineApi } from '@/lib/api';
import { CreateJobData, JobFilters, JobStatus, JobsResponse, Priority, UpdateJobData } from '@/types/job';
import { analyticsKeys } from './useAnalytics';
import { reminderKeys } from './useReminders';

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: JobFilters) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  notes: (id: string) => [...jobKeys.detail(id), 'notes'] as const,
  timeline: (id: string) => [...jobKeys.detail(id), 'timeline'] as const,
};

export const useJobs = (filters: JobFilters) =>
  useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => jobsApi.getAll(filters),
  });

export const useJob = (id: string | undefined) =>
  useQuery({
    queryKey: jobKeys.detail(id || ''),
    queryFn: () => jobsApi.getById(id!),
    enabled: Boolean(id),
  });

export const useJobNotes = (id: string | undefined) =>
  useQuery({
    queryKey: jobKeys.notes(id || ''),
    queryFn: () => notesApi.getAll(id!),
    enabled: Boolean(id),
  });

export const useJobTimeline = (id: string | undefined) =>
  useQuery({
    queryKey: jobKeys.timeline(id || ''),
    queryFn: () => timelineApi.getAll(id!),
    enabled: Boolean(id),
  });

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobData) => jobsApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobData }) => jobsApi.update(id, data),
    onSuccess: (_res, { id }) => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
      void queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: jobKeys.timeline(id) });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
};

export const useOptimisticStatusChange = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      jobsApi.update(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: jobKeys.lists() });
      const previousLists = queryClient.getQueriesData<JobsResponse>({
        queryKey: jobKeys.lists(),
      });

      queryClient.setQueriesData<JobsResponse>({ queryKey: jobKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          jobs: old.jobs.map((job) => (job._id === id ? { ...job, status } : job)),
        };
      });

      return { previousLists };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousLists) {
        for (const [queryKey, data] of context.previousLists) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: (_res, _err, { id }) => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
      void queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
};

export const useBulkDeleteJobs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => jobsApi.bulkDelete(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
      void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
};

export const useBulkUpdateJobs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: { status?: JobStatus; priority?: Priority } }) =>
      jobsApi.bulkUpdate(ids, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.all });
      void queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, text }: { jobId: string; text: string }) => notesApi.add(jobId, text),
    onSuccess: (_res, { jobId }) => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.notes(jobId) });
      void queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, noteId }: { jobId: string; noteId: string }) =>
      notesApi.delete(jobId, noteId),
    onSuccess: (_res, { jobId }) => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.notes(jobId) });
      void queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
    },
  });
};
