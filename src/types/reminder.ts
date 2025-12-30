import { Job } from './job';

export interface Reminder {
  _id: string;
  job: Pick<Job, '_id' | 'company' | 'position' | 'status'>;
  remindAt: string;
  note?: string;
  createdAt: string;
}

export interface CreateReminderData {
  remindAt: string;
  note?: string;
}
