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
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Enquetes collectees
              <ClipboardList className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{completion.collected}</p>
            <p className="mt-1 text-sm text-muted-foreground">Objectif: {completion.required}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Taux de completion
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold">{formatPercent(completion.completionRate)}</p>
            <Progress value={completion.completionRate} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Enquetes avec transport facture
              <Route className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold">{withTransportCount}</p>
            <Badge variant="muted">Indicateur C01 = Oui</Badge>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
