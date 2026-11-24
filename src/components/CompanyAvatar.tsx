import { cn } from '@/lib/utils';

interface CompanyAvatarProps {
  company: string;
  className?: string;
}

const getInitials = (company: string): string => {
  const words = company.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export const CompanyAvatar = ({ company, className }: CompanyAvatarProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-md border border-border bg-secondary/70 text-foreground font-mono text-[11px] font-medium tracking-tight shrink-0',
        className
      )}
      aria-hidden="true"
    >
      {getInitials(company)}
    </div>
  );
};
