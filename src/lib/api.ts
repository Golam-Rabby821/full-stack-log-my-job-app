import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  Job, 
  JobsResponse, 
  CreateJobData, 
  UpdateJobData,
  JobFilters,
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  Note,
  TimelineEvent
} from '@/types/job';
import { AnalyticsOverview, AnalyticsTrends, AnalyticsMonthly } from '@/types/analytics';
import { Reminder, CreateReminderData } from '@/types/reminder';

const API_BASE_URL = 'https://jobs-api-03hd.onrender.com/api/v1';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ msg: 'An error occurred' }));
    throw new Error(error.msg || 'An error occurred');
  }
  return response.json();
};

// Build query string from filters
const buildQueryString = (filters: JobFilters): string => {
  const params = new URLSearchParams();
  
  if (filters.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  if (filters.jobType && filters.jobType !== 'all') {
    params.append('jobType', filters.jobType);
  }
  if (filters.priority && filters.priority !== 'all') {
    params.append('priority', filters.priority);
  }
  if (filters.location) {
    params.append('location', filters.location);
  }
  if (filters.tags && filters.tags.length > 0) {
    params.append('tags', filters.tags.join(','));
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.sort) {
    params.append('sort', filters.sort);
  }
  if (filters.page) {
    params.append('page', filters.page.toString());
  }
  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

// Auth endpoints
export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  getMe: async (): Promise<{ user: UserProfile }> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: UserProfile }>(response);
  },

  updateProfile: async (data: UpdateProfileData): Promise<{ user: UserProfile; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/update`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ user: UserProfile; token: string }>(response);
  },

  changePassword: async (data: ChangePasswordData): Promise<{ msg: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ msg: string }>(response);
  },

  deleteAccount: async (): Promise<{ msg: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/delete`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ msg: string }>(response);
  },
};

// Jobs endpoints
export const jobsApi = {
  getAll: async (filters: JobFilters = {}): Promise<JobsResponse> => {
    const queryString = buildQueryString(filters);
    const response = await fetch(`${API_BASE_URL}/jobs${queryString}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<JobsResponse>(response);
  },

  getById: async (id: string): Promise<{ job: Job }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ job: Job }>(response);
  },

  create: async (data: CreateJobData): Promise<{ job: Job }> => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ job: Job }>(response);
  },

  update: async (id: string, data: UpdateJobData): Promise<{ job: Job }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ job: Job }>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ msg: 'An error occurred' }));
      throw new Error(error.msg || 'An error occurred');
    }
  },

  // Bulk operations
  bulkDelete: async (ids: string[]): Promise<{ msg: string; deletedCount: number }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/bulk-delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    return handleResponse<{ msg: string; deletedCount: number }>(response);
  },

  bulkUpdate: async (ids: string[], data: { status?: string; priority?: string }): Promise<{ msg: string; modifiedCount: number }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/bulk-update`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, ...data }),
    });
    return handleResponse<{ msg: string; modifiedCount: number }>(response);
  },

  // Export
  exportCsv: async (): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/jobs/export/csv`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to export CSV');
    }
    return response.blob();
  },

  exportPdf: async (): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/jobs/export/pdf`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to export PDF');
    }
    return response.blob();
  },
};

// Notes endpoints
export const notesApi = {
  getAll: async (jobId: string): Promise<{ notes: Note[] }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/notes`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ notes: Note[] }>(response);
  },

  add: async (jobId: string, text: string): Promise<{ note: Note }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    return handleResponse<{ note: Note }>(response);
  },

  delete: async (jobId: string, noteId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/notes/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ msg: 'An error occurred' }));
      throw new Error(error.msg || 'An error occurred');
    }
  },
};

// Timeline endpoints
export const timelineApi = {
  getAll: async (jobId: string): Promise<{ timeline: TimelineEvent[] }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/timeline`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ timeline: TimelineEvent[] }>(response);
  },

  add: async (jobId: string, data: { event: string; description?: string; date?: string }): Promise<{ event: TimelineEvent }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/timeline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ event: TimelineEvent }>(response);
  },
};

// Analytics endpoints
export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AnalyticsOverview>(response);
  },

  getTrends: async (): Promise<AnalyticsTrends> => {
    const response = await fetch(`${API_BASE_URL}/analytics/trends`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AnalyticsTrends>(response);
  },

  getMonthly: async (): Promise<AnalyticsMonthly> => {
    const response = await fetch(`${API_BASE_URL}/analytics/monthly`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AnalyticsMonthly>(response);
  },
};

// Reminders endpoints
export const remindersApi = {
  getAll: async (includePast: boolean = false): Promise<{ reminders: Reminder[] }> => {
    const query = includePast ? '?includePast=true' : '';
    const response = await fetch(`${API_BASE_URL}/reminders${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ reminders: Reminder[] }>(response);
  },

  create: async (jobId: string, data: CreateReminderData): Promise<{ reminder: Reminder }> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/reminder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ reminder: Reminder }>(response);
  },

  delete: async (reminderId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/reminders/${reminderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ msg: 'An error occurred' }));
      throw new Error(error.msg || 'An error occurred');
    }
  },
};
