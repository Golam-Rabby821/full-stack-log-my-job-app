import { JobStatus, JobType, Priority, JobFilters } from '@/types/job';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X, MapPin, Briefcase, AlertCircle, ArrowUpDown } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  onReset: () => void;
}

const statusOptions: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
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
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const sortOptions: { value: string; label: string }[] = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'company', label: 'Company A-Z' },
  { value: '-company', label: 'Company Z-A' },
  { value: '-priority', label: 'Priority High-Low' },
  { value: 'priority', label: 'Priority Low-High' },
];

export const AdvancedFilters = ({ filters, onChange, onReset }: AdvancedFiltersProps) => {
  const hasActiveFilters = 
    (filters.status && filters.status !== 'all') ||
    (filters.jobType && filters.jobType !== 'all') ||
    (filters.priority && filters.priority !== 'all') ||
    filters.sort;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select 
        value={filters.status || 'all'} 
        onValueChange={(v) => onChange({ ...filters, status: v as JobStatus | 'all', page: 1 })}
      >
        <SelectTrigger className="w-[130px] glass h-9 text-sm">
          <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.jobType || 'all'} 
        onValueChange={(v) => onChange({ ...filters, jobType: v as JobType | 'all', page: 1 })}
      >
        <SelectTrigger className="w-[120px] glass h-9 text-sm">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {jobTypeOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.priority || 'all'} 
        onValueChange={(v) => onChange({ ...filters, priority: v as Priority | 'all', page: 1 })}
      >
        <SelectTrigger className="w-[130px] glass h-9 text-sm">
          <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {priorityOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.sort || '-createdAt'} 
        onValueChange={(v) => onChange({ ...filters, sort: v })}
      >
        <SelectTrigger className="w-[150px] glass h-9 text-sm">
          <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
};
