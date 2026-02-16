import { DashboardDataset } from "@/types/survey";

export interface KoboClientInput {
  baseUrl: string;
  token: string;
  assetUid: string;
}

export interface KoboClientResult {
  dataset: DashboardDataset;
  totalRaw: number;
}

export async function fetchKoboSubmissions(input: KoboClientInput): Promise<KoboClientResult> {
  const response = await fetch("/api/kobo/submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  const payload = (await response.json()) as
    | { dataset: DashboardDataset; totalRaw: number }
    | { error: string };

  if (!response.ok || "error" in payload) {
    throw new Error("error" in payload ? payload.error : "Import Kobo impossible.");
  }

  return payload;
}
