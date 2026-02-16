"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CompletionStats } from "@/types/analytics";
import { formatPercent } from "@/lib/utils/format";

interface SurveyProgressCardsProps {
  completion: CompletionStats;
  withTransportCount: number;
}

export function SurveyProgressCards({
  completion,
  withTransportCount
}: SurveyProgressCardsProps): JSX.Element {
  const ratio =
    completion.collected === 0 ? 0 : Math.min(100, (withTransportCount / completion.collected) * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Enquetes collectees
              <span className="rounded-full bg-accent/10 p-2">
                <ClipboardList className="h-4 w-4 text-accent" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight text-foreground">{completion.collected}</p>
            <p className="mt-1 text-sm text-muted-foreground">Objectif: {completion.required}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white backdrop-blur-none">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-white">
              Taux de completion
              <span className="rounded-full bg-white/20 p-2 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <p className="text-4xl font-semibold tracking-tight">{formatPercent(completion.completionRate)}</p>
            <Progress value={completion.completionRate} className="bg-white/20" />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-200/25 blur-2xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Enquetes avec transport facture
              <span className="rounded-full bg-accent/10 p-2">
                <Route className="h-4 w-4 text-accent" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-4xl font-semibold tracking-tight text-foreground">{withTransportCount}</p>
            <div className="flex items-center justify-between">
              <Badge variant="muted">Indicateur C01 = Oui</Badge>
              <p className="text-xs font-medium text-muted-foreground">{formatPercent(ratio)}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
