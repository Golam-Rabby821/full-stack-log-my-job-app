import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  showWordmark?: boolean;
}

export const BrandMark = ({ className, showWordmark = true }: BrandMarkProps) => {
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <rect x="4" y="5.5" width="9" height="2.25" rx="1.125" fill="currentColor" />
          <rect x="6.5" y="10.875" width="13.5" height="2.25" rx="1.125" fill="currentColor" />
          <rect
            x="4"
            y="16.25"
            width="11"
            height="2.25"
            rx="1.125"
            fill="currentColor"
            opacity="0.55"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-semibold text-[15px] tracking-[-0.02em] text-foreground">
          LogMyJobs
        </span>
      )}
    </span>
  );
};
