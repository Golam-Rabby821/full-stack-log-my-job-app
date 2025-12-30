import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive/20 text-destructive",
        outline: "text-foreground",
        // Job status variants
        pending: "border-transparent bg-warning/20 text-warning",
        interview: "border-transparent bg-info/20 text-info",
        declined: "border-transparent bg-destructive/20 text-destructive",
        offer: "border-transparent bg-success/20 text-success",
        accepted: "border-transparent bg-success/30 text-success font-semibold",
        success: "border-transparent bg-success/20 text-success",
        // Priority variants
        high: "border-transparent bg-destructive/20 text-destructive",
        medium: "border-transparent bg-warning/20 text-warning",
        low: "border-transparent bg-muted text-muted-foreground",
        // Job type variants
        remote: "border-transparent bg-info/20 text-info",
        hybrid: "border-transparent bg-primary/20 text-primary",
        onsite: "border-transparent bg-secondary text-secondary-foreground",
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
