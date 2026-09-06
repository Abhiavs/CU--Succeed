import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer gap-2 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
        secondary:
          "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline:
          "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-xs",
        ghost:
          "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
        glass:
          "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
        link:
          "text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-sm font-semibold",
        xl: "h-12 rounded-xl px-8 text-base font-semibold",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
