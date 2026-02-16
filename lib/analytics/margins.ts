import {
  CompletionStats,
  DashboardAnalytics,
  GeoAuditStats,
  GroupedSeriesItem,
  MarginKpis
} from "@/types/analytics";
import { DashboardDataset } from "@/types/survey";

function computeCompletion(totalSubmissions: number, required = 5): CompletionStats {
  const collected = totalSubmissions;
  const completionRate = required === 0 ? 100 : Math.min(100, (collected / required) * 100);
  return { required, collected, completionRate };
}

function computeMarginKpis(values: number[]): MarginKpis {
  if (values.length === 0) {
    return { average: 0, min: 0, max: 0, totalRows: 0 };
  }

  const total = values.reduce((acc, current) => acc + current, 0);
  return {
    average: total / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    totalRows: values.length
  };
}

function groupAverages<T extends { marginAmount: number }>(
  rows: T[],
  keyGetter: (row: T) => string
): GroupedSeriesItem[] {
  const groups = new Map<string, { sum: number; count: number }>();

  rows.forEach((row) => {
    const key = keyGetter(row) || "Non renseigne";
    const entry = groups.get(key);
    if (entry) {
      entry.sum += row.marginAmount;
      entry.count += 1;
      return;
    }
    groups.set(key, { sum: row.marginAmount, count: 1 });
  });

  return Array.from(groups.entries())
    .map(([key, value]) => ({
      key,
      average: value.sum / value.count,
      count: value.count
    }))
    .sort((a, b) => b.average - a.average);
}

function computeGeoAuditStats(dataset: DashboardDataset, thresholdMeters = 50): GeoAuditStats {
  const audits = dataset.geoAudits ?? [];
  const total = audits.length;
  let checked = 0;
  let successCount = 0;
  let criticalCount = 0;
  let missingCount = 0;

  audits.forEach((entry) => {
    if (entry.status === "missing") {
      missingCount += 1;
      return;
    }
    checked += 1;
    if (entry.status === "success") {
      successCount += 1;
      return;
    }
    criticalCount += 1;
  });

  const criticalRate = checked === 0 ? 0 : (criticalCount / checked) * 100;
  return {
    thresholdMeters,
    total,
    checked,
    successCount,
    criticalCount,
    missingCount,
    criticalRate
  };
}

export function buildDashboardAnalytics(dataset: DashboardDataset): DashboardAnalytics {
  const values = dataset.rows.map((row) => row.marginAmount);
  const geoAudits = dataset.geoAudits ?? [];
  const geoAudit = computeGeoAuditStats(dataset, 50);

  return {
    completion: computeCompletion(dataset.totalSubmissions, 5),
    kpis: computeMarginKpis(values),
    bySupplier: groupAverages(dataset.rows, (row) => row.supplierTypeLabel),
    byUnit: groupAverages(dataset.rows, (row) => row.unitLabel),
    geoPoints: dataset.rows
      .map((row) => row.gps)
      .filter((point): point is NonNullable<typeof point> => Boolean(point)),
    geoAudit,
    auditLogs: geoAudits,
    comparisonPoints: geoAudits.filter(
      (entry) => Boolean(entry.expectedGps) && Boolean(entry.actualGps)
    )
  };
}
