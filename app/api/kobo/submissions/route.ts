import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { KoboApiPage, KoboObject } from "@/types/kobo";
import { normalizeKoboSubmissionsWithOptions } from "@/lib/kobo/normalize";

interface ImportRequestBody {
  baseUrl?: string;
  token?: string;
  assetUid?: string;
}

function cleanBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "");
}

function ensureAbsoluteUrl(url: string, fallbackBaseUrl: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `${fallbackBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseCsvLine(line: string): string[] {
  const output: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\"") {
      const next = line[i + 1];
      if (inQuotes && next === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      output.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  output.push(current.trim());
  return output;
}

async function loadCommercantsGeoById(): Promise<Record<string, string>> {
  const candidatePaths = [
    path.join(process.cwd(), "commercants.csv"),
    path.join(process.cwd(), "..", "commercants.csv")
  ];

  let csvContent = "";
  for (const filePath of candidatePaths) {
    try {
      csvContent = await readFile(filePath, "utf-8");
      if (csvContent.trim()) {
        break;
      }
    } catch {
      // Try next candidate path.
    }
  }

  if (!csvContent.trim()) {
    return {};
  }

  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return {};
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const nameIndex = headers.findIndex((header) => header === "name");
  const locIndex = headers.findIndex((header) => header === "localisation");
  if (nameIndex < 0 || locIndex < 0) {
    return {};
  }

  const geoById: Record<string, string> = {};
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const rawId = cols[nameIndex]?.trim().toLowerCase() ?? "";
    const rawLoc = cols[locIndex]?.trim() ?? "";
    if (!rawId || !rawLoc) {
      continue;
    }
    geoById[rawId] = rawLoc;
  }

  return geoById;
}

async function fetchAllSubmissions(
  baseUrl: string,
  token: string,
  assetUid: string
): Promise<KoboObject[]> {
  const records: KoboObject[] = [];
  let nextUrl: string | null = `${baseUrl}/api/v2/assets/${assetUid}/data/?format=json&page_size=500`;
  let guard = 0;

  while (nextUrl && guard < 100) {
    const response = await fetch(nextUrl, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Kobo API error (${response.status}): ${body.slice(0, 200)}`);
    }

    const page = (await response.json()) as KoboApiPage;
    const batch = Array.isArray(page.results) ? page.results : [];
    records.push(...batch);

    nextUrl = page.next ? ensureAbsoluteUrl(page.next, baseUrl) : null;
    guard += 1;
  }

  return records;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ImportRequestBody;

    const baseUrl = cleanBaseUrl(body.baseUrl || process.env.KOBO_BASE_URL || "");
    const token = body.token || process.env.KOBO_API_TOKEN || "";
    const assetUid = body.assetUid || process.env.KOBO_FORM_ID || "";

    if (!baseUrl || !token || !assetUid) {
      return NextResponse.json(
        {
          error:
            "Configuration Kobo incomplète. Renseignez URL, token et ID du formulaire (asset UID)."
        },
        { status: 400 }
      );
    }

    const [raw, commercantsGeoById] = await Promise.all([
      fetchAllSubmissions(baseUrl, token, assetUid),
      loadCommercantsGeoById()
    ]);
    const dataset = normalizeKoboSubmissionsWithOptions(raw, { commercantsGeoById });

    return NextResponse.json({ dataset, totalRaw: raw.length }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur inattendue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
