import { Job } from './job';

export type ReminderStatus = 'pending' | 'done' | 'cancelled';

export interface Reminder {
  _id: string;
  job: Pick<Job, '_id' | 'company' | 'position' | 'status'> | null;
  remindAt: string;
  note?: string;
  status: ReminderStatus;
  createdAt: string;
}

export interface CreateReminderData {
  remindAt: string;
  note?: string;
}

export interface UpdateReminderData {
  status?: ReminderStatus;
  remindAt?: string;
  note?: string;
}
