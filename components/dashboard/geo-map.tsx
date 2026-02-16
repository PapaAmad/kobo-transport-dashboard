"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeoPoint } from "@/types/survey";

const DynamicLeafletMap = dynamic(
  () => import("@/components/dashboard/geo-map-inner").then((module) => module.GeoMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
        Chargement de la carte...
      </div>
    )
  }
);

interface GeoMapProps {
  points: GeoPoint[];
}

export function GeoMap({ points }: GeoMapProps): JSX.Element {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
      <Card>
        <CardHeader>
          <CardTitle>Visualisation geographique</CardTitle>
          <CardDescription>
            Points GPS collectes ({points.length}). Source: champs `ent_gps` ou `localisation`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] overflow-hidden rounded-2xl border border-border/70">
            <DynamicLeafletMap points={points} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
