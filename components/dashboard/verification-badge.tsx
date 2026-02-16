"use client";

import { AlertTriangle, CheckCircle2, CircleSlash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerificationStatus } from "@/types/survey";
import { cn } from "@/lib/utils/cn";

interface VerificationBadgeProps {
  status: VerificationStatus;
  label?: string;
}

export function VerificationBadge({
  status,
  label
}: VerificationBadgeProps): JSX.Element {
  if (status === "success") {
    return (
      <Badge className={cn("gap-1.5 bg-emerald-500/15 text-emerald-700")}>
        <CheckCircle2 className="h-3.5 w-3.5" />
        {label ?? "Position conforme"}
      </Badge>
    );
  }

  if (status === "critical") {
    return (
      <Badge className={cn("gap-1.5 bg-rose-500/15 text-rose-700")}>
        <AlertTriangle className="h-3.5 w-3.5" />
        {label ?? "Alerte GPS"}
      </Badge>
    );
  }

  return (
    <Badge className={cn("gap-1.5 bg-slate-500/15 text-slate-700")}>
      <CircleSlash2 className="h-3.5 w-3.5" />
      {label ?? "Données manquantes"}
    </Badge>
  );
}
