import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-foreground",
        secondary: "border-border/80 bg-secondary/70 text-secondary-foreground",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        outline: "border-border text-muted-foreground bg-transparent",
        // Job status variants
        pending: "border-warning/25 bg-warning/10 text-warning",
        interview: "border-info/25 bg-info/10 text-info",
        declined: "border-destructive/25 bg-destructive/10 text-destructive",
        offer: "border-success/25 bg-success/10 text-success",
        accepted: "border-success/35 bg-success/15 text-success font-semibold",
        success: "border-success/25 bg-success/10 text-success",
        // Priority variants
        high: "border-destructive/25 bg-destructive/10 text-destructive",
        medium: "border-warning/25 bg-warning/10 text-warning",
        low: "border-border bg-muted text-muted-foreground",
        // Job type variants
        remote: "border-accent/25 bg-accent/10 text-accent",
        hybrid: "border-info/25 bg-info/10 text-info",
        onsite: "border-border bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
