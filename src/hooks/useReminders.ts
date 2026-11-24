import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { remindersApi } from '@/lib/api';
import { CreateReminderData, UpdateReminderData } from '@/types/reminder';

export const reminderKeys = {
  all: ['reminders'] as const,
  list: (includePast: boolean) => [...reminderKeys.all, { includePast }] as const,
};

export const useReminders = (includePast: boolean = false) =>
  useQuery({
    queryKey: reminderKeys.list(includePast),
    queryFn: () => remindersApi.getAll(includePast),
  });

export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: CreateReminderData }) =>
      remindersApi.create(jobId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
};

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderData }) =>
      remindersApi.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
};
