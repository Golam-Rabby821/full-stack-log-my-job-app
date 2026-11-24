import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Gift,
  Kanban,
  List,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import { useAnalyticsOverview } from '@/hooks/useAnalytics';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import {
  useBulkDeleteJobs,
  useBulkUpdateJobs,
  useCreateJob,
  useDeleteJob,
  useJobs,
  useOptimisticStatusChange,
  useUpdateJob,
} from '@/hooks/useJobs';
import { jobsApi } from '@/lib/api';
import { CreateJobData, Job, JobFilters, JobStatus, Priority } from '@/types/job';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { BulkActions } from '@/components/BulkActions';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { JobCard } from '@/components/JobCard';
import { JobModal } from '@/components/JobModal';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Navbar } from '@/components/Navbar';
import { PaginationControls } from '@/components/PaginationControls';
import { ReminderWidget } from '@/components/ReminderWidget';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const ITEMS_PER_PAGE = 10;
const VIEW_MODE_KEY = 'logmyjobs_dashboard_view';

type ViewMode = 'list' | 'kanban';

const defaultFilters: JobFilters = {
  status: 'all',
  jobType: 'all',
  priority: 'all',
  search: '',
  sort: '-createdAt',
  page: 1,
  limit: ITEMS_PER_PAGE,
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    return stored === 'kanban' ? 'kanban' : 'list';
  });
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const activeFilters: JobFilters =
    viewMode === 'kanban'
      ? { ...filters, status: 'all', page: 1, limit: 100 }
      : filters;

  const { data: jobsData, isLoading } = useJobs(activeFilters);
  const { data: overview } = useAnalyticsOverview();

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const optimisticStatusMutation = useOptimisticStatusChange();
  const deleteJobMutation = useDeleteJob();
  const bulkDeleteMutation = useBulkDeleteJobs();
  const bulkUpdateMutation = useBulkUpdateJobs();

  const jobs = jobsData?.jobs ?? [];
  const totalJobs = jobsData?.totalJobs ?? 0;
  const numOfPages = jobsData?.numOfPages ?? 1;

  const stats = {
    total: overview?.totalJobs ?? 0,
    pending: overview?.byStatus?.pending ?? 0,
    interview: overview?.byStatus?.interview ?? 0,
    offer: overview?.byStatus?.offer ?? 0,
    accepted: overview?.byStatus?.accepted ?? 0,
    declined: overview?.byStatus?.declined ?? 0,
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
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
    setFilters((prev) => ({ ...prev, page }));
    setSelectedIds([]);
  };

  const handleCreateJob = async (data: CreateJobData) => {
    try {
      await createJobMutation.mutateAsync(data);
      toast.success('Job added successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create job');
      throw error;
    }
  };

  const handleUpdateJob = async (data: CreateJobData) => {
    if (!selectedJob) return;
    try {
      await updateJobMutation.mutateAsync({ id: selectedJob._id, data });
      toast.success('Job updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
      throw error;
    }
  };

  const handleKanbanStatusChange = (jobId: string, newStatus: JobStatus) => {
    optimisticStatusMutation.mutate(
      { id: jobId, status: newStatus },
      {
        onSuccess: () => toast.success(`Moved to ${newStatus}`),
        onError: (error) =>
          toast.error(error instanceof Error ? error.message : 'Failed to update status'),
      }
    );
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJobMutation.mutateAsync(jobToDelete);
      toast.success('Job deleted successfully!');
      setJobToDelete(null);
      setSelectedIds((prev) => prev.filter((id) => id !== jobToDelete));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
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

  const toggleSelectJob = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(jobs.map((j) => j._id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedIds);
      toast.success(`${selectedIds.length} jobs deleted`);
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    } catch {
      toast.error('Failed to delete jobs');
    }
  };

  const handleBulkStatusUpdate = async (status: JobStatus) => {
    try {
      await bulkUpdateMutation.mutateAsync({ ids: selectedIds, data: { status } });
      toast.success(`${selectedIds.length} jobs updated to ${status}`);
      setSelectedIds([]);
    } catch {
      toast.error('Failed to update jobs');
    }
  };

  const handleBulkPriorityUpdate = async (priority: Priority) => {
    try {
      await bulkUpdateMutation.mutateAsync({ ids: selectedIds, data: { priority } });
      toast.success(`${selectedIds.length} jobs updated to ${priority} priority`);
      setSelectedIds([]);
    } catch {
      toast.error('Failed to update jobs');
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await jobsApi.exportCsv();
      downloadBlob(blob, 'jobs-export.csv');
      toast.success('Jobs exported to CSV');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPdf = async () => {
    try {
      const blob = await jobsApi.exportPdf();
      downloadBlob(blob, 'jobs-report.pdf');
      toast.success('Jobs exported to PDF');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your job applications</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border bg-secondary/40 p-1">
              <Button
                type="button"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-7 px-2.5 text-xs"
              >
                <List className="w-3.5 h-3.5 mr-1.5" />
                List
              </Button>
              <Button
                type="button"
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="h-7 px-2.5 text-xs"
              >
                <Kanban className="w-3.5 h-3.5 mr-1.5" />
                Kanban
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-border">
                <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard title="Total" value={stats.total} icon={Briefcase} color="primary" index={0} />
          <StatsCard title="Pending" value={stats.pending} icon={Clock} color="warning" index={1} />
          <StatsCard title="Interview" value={stats.interview} icon={MessageSquare} color="info" index={2} />
          <StatsCard title="Offer" value={stats.offer} icon={Gift} color="success" index={3} />
          <StatsCard title="Accepted" value={stats.accepted} icon={CheckCircle2} color="success" index={4} />
          <StatsCard title="Declined" value={stats.declined} icon={XCircle} color="destructive" index={5} />
        </div>

        <ReminderWidget />

        <div
          className="flex flex-col sm:flex-row gap-4 mb-4 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
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

        <div className="flex flex-col gap-3 mb-6">
          <AdvancedFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            hideStatusFilter={viewMode === 'kanban'}
          />
          {viewMode === 'list' && (
            <BulkActions
              selectedIds={selectedIds}
              totalItems={jobs.length}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onBulkDelete={() => setShowBulkDeleteConfirm(true)}
              onBulkStatusUpdate={handleBulkStatusUpdate}
              onBulkPriorityUpdate={handleBulkPriorityUpdate}
              isLoading={bulkDeleteMutation.isPending || bulkUpdateMutation.isPending}
            />
          )}
        </div>

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
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            jobs={jobs}
            onStatusChange={handleKanbanStatusChange}
            onEdit={handleEditClick}
            onDelete={(id) => setJobToDelete(id)}
          />
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

      <JobModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={selectedJob ? handleUpdateJob : handleCreateJob}
        job={selectedJob}
        isLoading={createJobMutation.isPending || updateJobMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        isLoading={deleteJobMutation.isPending}
      />

      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Jobs"
        description={`Are you sure you want to delete ${selectedIds.length} jobs? This action cannot be undone.`}
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
};

export default Dashboard;
