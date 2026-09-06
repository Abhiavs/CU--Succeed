import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        secondary:
          "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
        accent:
          "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
        destructive:
          "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
        outline:
          "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
