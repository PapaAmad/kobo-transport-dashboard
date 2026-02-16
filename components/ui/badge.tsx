import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps): JSX.Element {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" ? "bg-accent/12 text-accent" : "bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
