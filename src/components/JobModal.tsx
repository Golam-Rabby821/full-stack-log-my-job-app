import { useState, useEffect } from 'react';
import { Job, CreateJobData, JobStatus, JobType, Priority } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TagInput } from '@/components/TagInput';
import { Loader2, Briefcase, MapPin, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobData) => Promise<void>;
  job?: Job | null;
  isLoading?: boolean;
}

const initialFormData: CreateJobData = {
  company: '',
  position: '',
  status: 'pending',
  location: '',
  jobType: undefined,
  salary: '',
  jobUrl: '',
  description: '',
  appliedDate: format(new Date(), 'yyyy-MM-dd'),
  interviewDate: '',
  priority: 'medium',
  tags: [],
  contactName: '',
  contactEmail: '',
};

export const JobModal = ({ isOpen, onClose, onSubmit, job, isLoading }: JobModalProps) => {
  const [formData, setFormData] = useState<CreateJobData>(initialFormData);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        position: job.position,
        status: job.status,
        location: job.location || '',
        jobType: job.jobType,
        salary: job.salary || '',
        jobUrl: job.jobUrl || '',
        description: job.description || '',
        appliedDate: job.appliedDate ? format(new Date(job.appliedDate), 'yyyy-MM-dd') : '',
        interviewDate: job.interviewDate ? format(new Date(job.interviewDate), 'yyyy-MM-dd') : '',
        priority: job.priority || 'medium',
        tags: job.tags || [],
        contactName: job.contactName || '',
        contactEmail: job.contactEmail || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setActiveTab('basic');
  }, [job, isOpen]);

  const handleChange = (field: keyof CreateJobData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up empty fields
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== '' && v !== undefined && (Array.isArray(v) ? v.length > 0 : true))
    ) as CreateJobData;
    await onSubmit(cleanData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {job ? 'Edit Job' : 'Add New Job'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
              <TabsTrigger value="basic" className="gap-1.5 text-xs">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1.5 text-xs">
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    placeholder="Job title"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v: JobStatus) => handleChange('status', v)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority || 'medium'} onValueChange={(v: Priority) => handleChange('priority', v)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appliedDate">Applied Date</Label>
                  <Input
                    id="appliedDate"
                    type="date"
                    value={formData.appliedDate || ''}
                    onChange={(e) => handleChange('appliedDate', e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewDate">Interview Date</Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    value={formData.interviewDate || ''}
                    onChange={(e) => handleChange('interviewDate', e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={formData.jobType || ''} onValueChange={(v: JobType) => handleChange('jobType', v)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border">
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    value={formData.salary || ''}
                    onChange={(e) => handleChange('salary', e.target.value)}
                    placeholder="e.g. $80k - $120k"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job URL</Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    value={formData.jobUrl || ''}
                    onChange={(e) => handleChange('jobUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput
                  value={formData.tags || []}
                  onChange={(tags) => handleChange('tags', tags)}
                  placeholder="Type and press Enter"
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName || ''}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="Recruiter or hiring manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="recruiter@company.com"
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Job description, requirements, notes..."
                  className="min-h-[150px] bg-secondary/50"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="glow" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                job ? 'Update Job' : 'Add Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
