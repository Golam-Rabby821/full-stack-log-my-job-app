import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Download,
  FileText,
  Kanban,
  List,
  Loader2,
  Plus,
  Search,
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
import { Button } from '@/components/ui/button';
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

  const kpiSegments: {
    key: JobStatus | 'all';
    label: string;
    value: number;
    dotClass: string;
  }[] = [
    { key: 'all', label: 'Total', value: stats.total, dotClass: 'bg-foreground' },
    { key: 'pending', label: 'Pending', value: stats.pending, dotClass: 'bg-warning' },
    { key: 'interview', label: 'Interview', value: stats.interview, dotClass: 'bg-info' },
    { key: 'offer', label: 'Offer', value: stats.offer, dotClass: 'bg-success' },
    { key: 'accepted', label: 'Accepted', value: stats.accepted, dotClass: 'bg-success' },
    { key: 'declined', label: 'Declined', value: stats.declined, dotClass: 'bg-destructive' },
  ];

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-14">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track applications, interviews, and offers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-0.5">
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
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border shadow-md">
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

            <Button size="sm" onClick={() => setIsModalOpen(true)} className="h-8">
              <Plus className="w-3.5 h-3.5" />
              Add Job
            </Button>
          </div>
        </div>

        {/* Unified Segmented KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 rounded-xl border border-border bg-card divide-y sm:divide-y-0 sm:divide-x divide-border overflow-hidden mb-6">
          {kpiSegments.map((segment) => {
            const isSelected =
              viewMode === 'list' && (filters.status || 'all') === segment.key;
            return (
              <button
                key={segment.key}
                type="button"
                onClick={() => {
                  if (viewMode === 'list') {
                    handleFilterChange({ ...filters, status: segment.key, page: 1 });
                  }
                }}
                className={`px-4 py-3.5 text-left transition-colors ${
                  viewMode === 'list' ? 'hover:bg-secondary/40 cursor-pointer' : 'cursor-default'
                } ${isSelected ? 'bg-secondary/60' : ''}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${segment.dotClass}`} />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {segment.label}
                  </span>
                </div>
                <p className="text-2xl font-semibold font-mono tabular-nums text-foreground">
                  {segment.value}
                </p>
              </button>
            );
          })}
        </div>

        <ReminderWidget />

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search company, position, or tags..."
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-9 h-9 bg-card"
            />
          </div>

          <AdvancedFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            hideStatusFilter={viewMode === 'kanban'}
          />
        </div>

        {viewMode === 'list' && (
          <div className="mb-4">
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
          </div>
        )}

        {/* Jobs View */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 rounded-xl border border-border bg-card">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          stats.total === 0 ? (
            <EmptyState onAddJob={() => setIsModalOpen(true)} />
          ) : (
            <div className="text-center py-16 rounded-xl border border-border bg-card text-sm text-muted-foreground">
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
            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {jobs.map((job, index) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onEdit={handleEditClick}
                  onDelete={(id) => setJobToDelete(id)}
                  index={index}
                  selected={selectedIds.includes(job._id)}
                  onToggleSelect={toggleSelectJob}
                />
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
