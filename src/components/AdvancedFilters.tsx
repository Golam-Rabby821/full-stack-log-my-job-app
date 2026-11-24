import { JobStatus, JobType, Priority, JobFilters } from '@/types/job';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  onReset: () => void;
  hideStatusFilter?: boolean;
}

const statusOptions: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
];

const jobTypeOptions: { value: JobType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' },
];

const priorityOptions: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const sortOptions: { value: string; label: string }[] = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: 'company', label: 'Company A–Z' },
  { value: '-company', label: 'Company Z–A' },
  { value: '-priority', label: 'Priority' },
];

export const AdvancedFilters = ({
  filters,
  onChange,
  onReset,
  hideStatusFilter = false,
}: AdvancedFiltersProps) => {
  const activeFilterCount =
    (!hideStatusFilter && filters.status && filters.status !== 'all' ? 1 : 0) +
    (filters.jobType && filters.jobType !== 'all' ? 1 : 0) +
    (filters.priority && filters.priority !== 'all' ? 1 : 0);

  const hasAnyActive =
    activeFilterCount > 0 ||
    Boolean(filters.search) ||
    Boolean(filters.sort && filters.sort !== '-createdAt');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs bg-card">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded bg-secondary font-mono text-[10px] text-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52 max-h-80 overflow-y-auto bg-popover border-border shadow-md"
        >
          {!hideStatusFilter && (
            <>
              <DropdownMenuLabel className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Status
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={filters.status || 'all'}
                onValueChange={(v) =>
                  onChange({ ...filters, status: v as JobStatus | 'all', page: 1 })
                }
              >
                {statusOptions.map((opt) => (
                  <DropdownMenuRadioItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuLabel className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Work Type
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filters.jobType || 'all'}
            onValueChange={(v) =>
              onChange({ ...filters, jobType: v as JobType | 'all', page: 1 })
            }
          >
            {jobTypeOptions.map((opt) => (
              <DropdownMenuRadioItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Priority
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filters.priority || 'all'}
            onValueChange={(v) =>
              onChange({ ...filters, priority: v as Priority | 'all', page: 1 })
            }
          >
            {priorityOptions.map((opt) => (
              <DropdownMenuRadioItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        value={filters.sort || '-createdAt'}
        onValueChange={(v) => onChange({ ...filters, sort: v })}
      >
        <SelectTrigger className="w-[132px] bg-card h-9 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasAnyActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
};
