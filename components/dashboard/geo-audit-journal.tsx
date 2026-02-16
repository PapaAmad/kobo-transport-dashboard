"use client";

import { motion } from "framer-motion";
import { FileCheck2 } from "lucide-react";
import { VerificationBadge } from "@/components/dashboard/verification-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";
import { GeoAuditEntry } from "@/types/survey";

interface GeoAuditJournalProps {
  logs: GeoAuditEntry[];
  thresholdMeters: number;
}

export function GeoAuditJournal({
  logs,
  thresholdMeters
}: GeoAuditJournalProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32 }}
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileCheck2 className="h-4 w-4 text-accent" />
            Journal d&apos;audit geographique
          </CardTitle>
          <CardDescription>
            Controle strict de coherence GPS avec seuil de {thresholdMeters} m.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl border border-border/70">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/65 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Soumission</th>
                  <th className="px-4 py-3">Commercant</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Observation</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((entry) => (
                  <tr key={`${entry.submissionId}-${entry.commercantId}`} className="border-t border-border/60">
                    <td className="px-4 py-3 font-medium text-foreground">{entry.submissionId}</td>
                    <td className="px-4 py-3 text-foreground">{entry.commercantLabel}</td>
                    <td className="px-4 py-3 text-foreground">
                      {entry.distanceMeters === undefined
                        ? "-"
                        : `${formatNumber(Math.round(entry.distanceMeters))} m`}
                    </td>
                    <td className="px-4 py-3">
                      <VerificationBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.mapUrl ? (
                        <a
                          href={entry.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-accent hover:underline"
                        >
                          {entry.message}
                        </a>
                      ) : (
                        entry.message
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
