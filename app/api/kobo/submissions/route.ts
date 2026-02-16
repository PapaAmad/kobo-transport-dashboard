import { NextRequest, NextResponse } from "next/server";
import { KoboApiPage, KoboObject } from "@/types/kobo";
import { normalizeKoboSubmissions } from "@/lib/kobo/normalize";

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

    const raw = await fetchAllSubmissions(baseUrl, token, assetUid);
    const dataset = normalizeKoboSubmissions(raw);

    return NextResponse.json({ dataset, totalRaw: raw.length }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur inattendue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
