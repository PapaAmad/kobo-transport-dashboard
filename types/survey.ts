export interface GeoPoint {
  lat: number;
  lng: number;
}

export type VerificationStatus = "success" | "critical" | "missing";

export interface NormalizedCostRow {
  submissionId: string;
  marginAmount: number;
  supplierTypeCode: string;
  supplierTypeLabel: string;
  unitCode: string;
  unitLabel: string;
  gps?: GeoPoint;
}

export interface GeoAuditEntry {
  submissionId: string;
  commercantId: string;
  commercantLabel: string;
  expectedGps?: GeoPoint;
  actualGps?: GeoPoint;
  distanceMeters?: number;
  status: VerificationStatus;
  message: string;
  mapUrl?: string;
}

export interface DashboardDataset {
  rows: NormalizedCostRow[];
  totalSubmissions: number;
  withTransportCount: number;
  geoAudits: GeoAuditEntry[];
}
