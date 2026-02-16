"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { GeoAuditEntry } from "@/types/survey";

const DynamicComparisonMap = dynamic(
  () =>
    import("@/components/dashboard/geo-comparison-map-inner").then(
      (module) => module.GeoComparisonMapInner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
        Chargement de la carte comparative...
      </div>
    )
  }
);

interface GeoComparisonMapProps {
  entries: GeoAuditEntry[];
}

export function GeoComparisonMap({
  entries
}: GeoComparisonMapProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
    >
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-400/15 blur-3xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Radar className="h-4 w-4 text-accent" />
            Carte comparative GPS
          </CardTitle>
          <CardDescription>
            Bleu: position theorique. Vert: position reelle. Segment rouge si l&apos;ecart depasse 50 m.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] overflow-hidden rounded-2xl border border-border/70 shadow-inner">
            <DynamicComparisonMap entries={entries} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
