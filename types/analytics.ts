import { GeoPoint } from "@/types/survey";

export interface CompletionStats {
  required: number;
  collected: number;
  completionRate: number;
}

export interface MarginKpis {
  average: number;
  min: number;
  max: number;
  totalRows: number;
}

export interface GroupedSeriesItem {
  key: string;
  average: number;
  count: number;
}

export interface DashboardAnalytics {
  completion: CompletionStats;
  kpis: MarginKpis;
  bySupplier: GroupedSeriesItem[];
  byUnit: GroupedSeriesItem[];
  geoPoints: GeoPoint[];
}
