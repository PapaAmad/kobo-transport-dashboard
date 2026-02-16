import { KoboObject, KoboValue } from "@/types/kobo";
import { DashboardDataset, GeoPoint, NormalizedCostRow } from "@/types/survey";
import { getSupplierLabel, getUnitLabel } from "@/lib/kobo/lookups";

function asRecord(value: KoboValue): KoboObject | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as KoboObject;
  }
  return null;
}

function asArray(value: KoboValue): KoboValue[] {
  return Array.isArray(value) ? value : [];
}

function asNumber(value: KoboValue): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function asString(value: KoboValue): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

function parseGeoPoint(value: KoboValue): GeoPoint | undefined {
  const raw = asString(value);
  if (!raw) {
    return undefined;
  }

  const parts = raw.split(/\s+/);
  if (parts.length < 2) {
    return undefined;
  }

  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return undefined;
  }

  return { lat, lng };
}

function getAny(record: KoboObject, keys: string[]): KoboValue {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }
  return null;
}

function getSubmissionId(record: KoboObject, fallbackIndex: number): string {
  const candidates = ["_id", "_uuid", "_submission_time", "meta/instanceID"];
  for (const key of candidates) {
    const value = getAny(record, [key]);
    const str = asString(value);
    if (str) {
      return str;
    }
  }
  return `submission-${fallbackIndex}`;
}

function extractOrders(submission: KoboObject): KoboObject[] {
  const candidate = getAny(submission, ["cmd_repeat", "SectionCrepeat1"]);
  return asArray(candidate)
    .map(asRecord)
    .filter((row): row is KoboObject => row !== null);
}

function extractProducts(order: KoboObject): KoboObject[] {
  const candidate = getAny(order, ["prd_repeat", "SectionCrepeat2"]);
  const products = asArray(candidate)
    .map(asRecord)
    .filter((row): row is KoboObject => row !== null);
  if (products.length > 0) {
    return products;
  }
  return [order];
}

function submissionHasTransport(submission: KoboObject): boolean {
  const value = asString(getAny(submission, ["trp_facture_a_achat", "C01"]));
  return value === "1";
}

export function normalizeKoboSubmissions(records: KoboObject[]): DashboardDataset {
  const rows: NormalizedCostRow[] = [];
  let withTransportCount = 0;

  records.forEach((submission, index) => {
    const submissionId = getSubmissionId(submission, index + 1);
    const gps = parseGeoPoint(getAny(submission, ["ent_gps", "localisation"]));

    if (submissionHasTransport(submission)) {
      withTransportCount += 1;
    }

    const orders = extractOrders(submission);
    if (orders.length === 0) {
      return;
    }

    orders.forEach((order) => {
      const marginAmount = asNumber(getAny(order, ["cmd_montant_transport", "C05b"]));
      if (marginAmount === null || marginAmount <= 0) {
        return;
      }

      const supplierTypeCode = asString(getAny(order, ["cmd_fournisseur_type", "C04"]));
      const products = extractProducts(order);

      products.forEach((product) => {
        const unitCode = asString(getAny(product, ["prd_unite", "C03b"])) || "21";
        rows.push({
          submissionId,
          marginAmount,
          supplierTypeCode,
          supplierTypeLabel: getSupplierLabel(supplierTypeCode),
          unitCode,
          unitLabel: getUnitLabel(unitCode),
          gps
        });
      });
    });
  });

  return {
    rows,
    totalSubmissions: records.length,
    withTransportCount
  };
}
