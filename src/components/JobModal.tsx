import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Briefcase, FileText, Loader2, MapPin, User } from 'lucide-react';
import { CreateJobData, Job, JobStatus, JobType, Priority } from '@/types/job';
import { jobFormSchema, JobFormValues } from '@/schemas/forms';
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

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobData) => Promise<void>;
  job?: Job | null;
  isLoading?: boolean;
}

const getDefaultValues = (job?: Job | null): JobFormValues => {
  if (job) {
    return {
      company: job.company,
      position: job.position,
      status: job.status,
      priority: job.priority || 'medium',
      location: job.location || '',
      jobType: job.jobType,
      salary: job.salary || '',
      jobUrl: job.jobUrl || '',
      description: job.description || '',
      appliedDate: job.appliedDate ? format(new Date(job.appliedDate), 'yyyy-MM-dd') : '',
      interviewDate: job.interviewDate ? format(new Date(job.interviewDate), 'yyyy-MM-dd') : '',
      tags: job.tags || [],
      contactName: job.contactName || '',
      contactEmail: job.contactEmail || '',
    };
  }

  return {
    company: '',
    position: '',
    status: 'pending',
    priority: 'medium',
    location: '',
    jobType: undefined,
    salary: '',
    jobUrl: '',
    description: '',
    appliedDate: format(new Date(), 'yyyy-MM-dd'),
    interviewDate: '',
    tags: [],
    contactName: '',
    contactEmail: '',
  };
};

export const JobModal = ({ isOpen, onClose, onSubmit, job, isLoading }: JobModalProps) => {
  const [activeTab, setActiveTab] = useState('basic');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: getDefaultValues(job),
  });

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(job));
      setActiveTab('basic');
    }
  }, [job, isOpen, reset]);

  const onFormSubmit = async (values: JobFormValues) => {
    const payload: CreateJobData = job
      ? {
          company: values.company,
          position: values.position,
          status: values.status,
          priority: values.priority,
          location: values.location,
          jobType: values.jobType,
          salary: values.salary,
          jobUrl: values.jobUrl,
          description: values.description,
          appliedDate: values.appliedDate,
          interviewDate: values.interviewDate,
          tags: values.tags,
          contactName: values.contactName,
          contactEmail: values.contactEmail,
        }
      : {
          company: values.company,
          position: values.position,
          status: values.status,
          priority: values.priority,
          ...(values.location ? { location: values.location } : {}),
          ...(values.jobType ? { jobType: values.jobType } : {}),
          ...(values.salary ? { salary: values.salary } : {}),
          ...(values.jobUrl ? { jobUrl: values.jobUrl } : {}),
          ...(values.description ? { description: values.description } : {}),
          ...(values.appliedDate ? { appliedDate: values.appliedDate } : {}),
          ...(values.interviewDate ? { interviewDate: values.interviewDate } : {}),
          ...(values.tags.length > 0 ? { tags: values.tags } : {}),
          ...(values.contactName ? { contactName: values.contactName } : {}),
          ...(values.contactEmail ? { contactEmail: values.contactEmail } : {}),
        };

    await onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border border-border shadow-xl sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {job ? 'Edit Job' : 'Add New Job'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-1" noValidate>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/60">
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
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs font-medium">
                    Company *
                  </Label>
                  <Input id="company" placeholder="Company name" {...register('company')} />
                  {errors.company && (
                    <p className="text-xs text-destructive">{errors.company.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="position" className="text-xs font-medium">
                    Position *
                  </Label>
                  <Input id="position" placeholder="Job title" {...register('position')} />
                  {errors.position && (
                    <p className="text-xs text-destructive">{errors.position.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs font-medium">
                    Status
                  </Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={(v) => field.onChange(v as JobStatus)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priority" className="text-xs font-medium">
                    Priority
                  </Label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={(v) => field.onChange(v as Priority)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="appliedDate" className="text-xs font-medium">
                    Applied Date
                  </Label>
                  <Input
                    id="appliedDate"
                    type="date"
                    className="bg-background"
                    {...register('appliedDate')}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="interviewDate" className="text-xs font-medium">
                    Interview Date
                  </Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    className="bg-background"
                    {...register('interviewDate')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-medium">
                    Location
                  </Label>
                  <Input id="location" placeholder="City, Country" {...register('location')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="jobType" className="text-xs font-medium">
                    Job Type
                  </Label>
                  <Controller
                    name="jobType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ''}
                        onValueChange={(v) => field.onChange(v as JobType)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="onsite">Onsite</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="salary" className="text-xs font-medium">
                    Salary
                  </Label>
                  <Input id="salary" placeholder="e.g. $80k - $120k" {...register('salary')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="jobUrl" className="text-xs font-medium">
                    Job URL
                  </Label>
                  <Input id="jobUrl" type="url" placeholder="https://..." {...register('jobUrl')} />
                  {errors.jobUrl && (
                    <p className="text-xs text-destructive">{errors.jobUrl.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tags</Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type and press Enter"
                    />
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label htmlFor="contactName" className="text-xs font-medium">
                  Contact Name
                </Label>
                <Input
                  id="contactName"
                  placeholder="Recruiter or hiring manager"
                  {...register('contactName')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="text-xs font-medium">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="recruiter@company.com"
                  {...register('contactEmail')}
                />
                {errors.contactEmail && (
                  <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium">
                  Description / Notes
                </Label>
                <Textarea
                  id="description"
                  placeholder="Job description, requirements, notes..."
                  className="min-h-[150px] bg-background"
                  {...register('description')}
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
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : job ? (
                'Update Job'
              ) : (
                'Add Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
