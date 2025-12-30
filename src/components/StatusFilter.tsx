import { JobStatus } from '@/types/job';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

type FilterStatus = 'all' | JobStatus;

interface StatusFilterProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

const statusOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Jobs' },
  { value: 'pending', label: 'Pending' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
];

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] glass">
        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
