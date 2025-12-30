import { useState } from 'react';
import { JobStatus, Priority } from '@/types/job';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit, X, CheckSquare, Square } from 'lucide-react';

interface BulkActionsProps {
  selectedIds: string[];
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkStatusUpdate: (status: JobStatus) => void;
  onBulkPriorityUpdate: (priority: Priority) => void;
  isLoading?: boolean;
}

export const BulkActions = ({
  selectedIds,
  totalItems,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkStatusUpdate,
  onBulkPriorityUpdate,
  isLoading,
}: BulkActionsProps) => {
  const [statusValue, setStatusValue] = useState<string>('');
  const [priorityValue, setPriorityValue] = useState<string>('');

  const handleStatusChange = (value: string) => {
    setStatusValue(value);
    if (value) {
      onBulkStatusUpdate(value as JobStatus);
      setStatusValue('');
    }
  };

  const handlePriorityChange = (value: string) => {
    setPriorityValue(value);
    if (value) {
      onBulkPriorityUpdate(value as Priority);
      setPriorityValue('');
    }
  };

  const allSelected = selectedIds.length === totalItems && totalItems > 0;
  const someSelected = selectedIds.length > 0;

  if (!someSelected) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="text-muted-foreground h-8"
          disabled={totalItems === 0}
        >
          <Square className="w-4 h-4 mr-1.5" />
          Select All
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 glass rounded-lg animate-scale-in">
      <div className="flex items-center gap-2 mr-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => checked ? onSelectAll() : onDeselectAll()}
        />
        <span className="text-sm font-medium text-foreground">
          {selectedIds.length} selected
        </span>
      </div>

      <Select value={statusValue} onValueChange={handleStatusChange} disabled={isLoading}>
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          <SelectValue placeholder="Set Status" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="interview">Interview</SelectItem>
          <SelectItem value="offer">Offer</SelectItem>
          <SelectItem value="accepted">Accepted</SelectItem>
          <SelectItem value="declined">Declined</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priorityValue} onValueChange={handlePriorityChange} disabled={isLoading}>
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          <SelectValue placeholder="Set Priority" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
        disabled={isLoading}
        className="h-8"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        Delete
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDeselectAll}
        className="h-8 text-muted-foreground"
      >
        <X className="w-4 h-4 mr-1" />
        Cancel
      </Button>
    </div>
  );
};
