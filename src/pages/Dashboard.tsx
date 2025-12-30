import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@/lib/api';
import { Job, CreateJobData, JobStatus, JobFilters, Priority } from '@/types/job';
import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/components/JobCard';
import { JobModal } from '@/components/JobModal';
import { StatsCard } from '@/components/StatsCard';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { PaginationControls } from '@/components/PaginationControls';
import { BulkActions } from '@/components/BulkActions';
import { ReminderWidget } from '@/components/ReminderWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Briefcase, 
  Clock, 
  MessageSquare, 
  XCircle,
  Loader2,
  Gift,
  CheckCircle2,
  Download
} from 'lucide-react';
import { useDebouncedCallback } from '@/hooks/useDebounce';

const ITEMS_PER_PAGE = 10;

const defaultFilters: JobFilters = {
  status: 'all',
  jobType: 'all',
  priority: 'all',
  search: '',
  sort: '-createdAt',
  page: 1,
  limit: ITEMS_PER_PAGE,
};

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [numOfPages, setNumOfPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    offer: 0,
    accepted: 0,
    declined: 0,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await jobsApi.getAll(filters);
      setJobs(response.jobs);
      setTotalJobs(response.totalJobs);
      setNumOfPages(response.numOfPages);
      
      // Fetch stats separately (without filters)
      const statsResponse = await jobsApi.getAll({ limit: 1000 });
      const allJobs = statsResponse.jobs;
      setStats({
        total: statsResponse.totalJobs,
        pending: allJobs.filter(j => j.status === 'pending').length,
        interview: allJobs.filter(j => j.status === 'interview').length,
        offer: allJobs.filter(j => j.status === 'offer').length,
        accepted: allJobs.filter(j => j.status === 'accepted').length,
        declined: allJobs.filter(j => j.status === 'declined').length,
      });
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchInput('');
    setSelectedIds([]);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    setSelectedIds([]);
  };

  const handleCreateJob = async (data: CreateJobData) => {
    setIsSaving(true);
    try {
      await jobsApi.create(data);
      await fetchJobs();
      toast.success('Job added successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create job');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateJob = async (data: CreateJobData) => {
    if (!selectedJob) return;
    setIsSaving(true);
    try {
      await jobsApi.update(selectedJob._id, data);
      await fetchJobs();
      toast.success('Job updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await jobsApi.delete(jobToDelete);
      await fetchJobs();
      toast.success('Job deleted successfully!');
      setJobToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Bulk actions
  const toggleSelectJob = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(jobs.map(j => j._id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await jobsApi.bulkDelete(selectedIds);
      await fetchJobs();
      toast.success(`${selectedIds.length} jobs deleted`);
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete jobs');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkStatusUpdate = async (status: JobStatus) => {
    try {
      await jobsApi.bulkUpdate(selectedIds, { status });
      await fetchJobs();
      toast.success(`${selectedIds.length} jobs updated to ${status}`);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Failed to update jobs');
    }
  };

  const handleBulkPriorityUpdate = async (priority: Priority) => {
    try {
      await jobsApi.bulkUpdate(selectedIds, { priority });
      await fetchJobs();
      toast.success(`${selectedIds.length} jobs updated to ${priority} priority`);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Failed to update jobs');
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await jobsApi.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jobs-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Jobs exported to CSV');
    } catch (error) {
      toast.error('Failed to export jobs');
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your job applications</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="hidden sm:flex">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard title="Total" value={stats.total} icon={Briefcase} color="primary" index={0} />
          <StatsCard title="Pending" value={stats.pending} icon={Clock} color="warning" index={1} />
          <StatsCard title="Interview" value={stats.interview} icon={MessageSquare} color="info" index={2} />
          <StatsCard title="Offer" value={stats.offer} icon={Gift} color="success" index={3} />
          <StatsCard title="Accepted" value={stats.accepted} icon={CheckCircle2} color="success" index={4} />
          <StatsCard title="Declined" value={stats.declined} icon={XCircle} color="destructive" index={5} />
        </div>

        {/* Reminder Widget */}
        <ReminderWidget />

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search company, position, or tags..."
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Button variant="glow" onClick={() => setIsModalOpen(true)} className="shrink-0">
            <Plus className="w-5 h-5" />
            Add Job
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <AdvancedFilters 
            filters={filters} 
            onChange={handleFilterChange} 
            onReset={handleResetFilters} 
          />
          <BulkActions
            selectedIds={selectedIds}
            totalItems={jobs.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkDelete={() => setShowBulkDeleteConfirm(true)}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onBulkPriorityUpdate={handleBulkPriorityUpdate}
            isLoading={isDeleting}
          />
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          stats.total === 0 ? (
            <EmptyState onAddJob={() => setIsModalOpen(true)} />
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              No jobs match your filters
            </div>
          )
        ) : (
          <>
            <div className="grid gap-4">
              {jobs.map((job, index) => (
                <div key={job._id} className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.includes(job._id)}
                    onCheckedChange={() => toggleSelectJob(job._id)}
                    className="shrink-0"
                  />
                  <div className="flex-1">
                    <JobCard
                      job={job}
                      onEdit={handleEditClick}
                      onDelete={(id) => setJobToDelete(id)}
                      index={index}
                    />
                  </div>
                </div>
              ))}
            </div>

            <PaginationControls
              currentPage={filters.page || 1}
              totalPages={numOfPages}
              onPageChange={handlePageChange}
              totalItems={totalJobs}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <JobModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={selectedJob ? handleUpdateJob : handleCreateJob}
        job={selectedJob}
        isLoading={isSaving}
      />

      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Jobs"
        description={`Are you sure you want to delete ${selectedIds.length} jobs? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
