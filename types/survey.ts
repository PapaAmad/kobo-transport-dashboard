export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NormalizedCostRow {
  submissionId: string;
  marginAmount: number;
  supplierTypeCode: string;
  supplierTypeLabel: string;
  unitCode: string;
  unitLabel: string;
  gps?: GeoPoint;
}

export interface DashboardDataset {
  rows: NormalizedCostRow[];
  totalSubmissions: number;
  withTransportCount: number;
}
