export type JobStatus = 'pending' | 'interview' | 'declined' | 'offer' | 'accepted';
export type JobType = 'remote' | 'hybrid' | 'onsite';
export type Priority = 'high' | 'medium' | 'low';

export interface Note {
  _id: string;
  text: string;
  createdAt: string;
}

export interface TimelineEvent {
  _id: string;
  event: string;
  date: string;
  description?: string;
}

export interface Job {
  _id: string;
  company: string;
  position: string;
  status: JobStatus;
  location?: string;
  jobType?: JobType;
  salary?: string;
  jobUrl?: string;
  description?: string;
  appliedDate?: string;
  interviewDate?: string;
  priority?: Priority;
  tags?: string[];
  contactName?: string;
  contactEmail?: string;
  notes?: Note[];
  timeline?: TimelineEvent[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface JobsResponse {
  jobs: Job[];
  totalJobs: number;
  numOfPages: number;
  currentPage: number;
}

export interface JobFilters {
  status?: JobStatus | 'all';
  jobType?: JobType | 'all';
  priority?: Priority | 'all';
  location?: string;
  tags?: string[];
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreateJobData {
  company: string;
  position: string;
  status?: JobStatus;
  location?: string;
  jobType?: JobType;
  salary?: string;
  jobUrl?: string;
  description?: string;
  appliedDate?: string;
  interviewDate?: string;
  priority?: Priority;
  tags?: string[];
  contactName?: string;
  contactEmail?: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
