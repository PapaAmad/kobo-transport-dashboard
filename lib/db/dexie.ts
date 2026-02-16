import Dexie, { Table } from "dexie";
import { DashboardDataset } from "@/types/survey";

export interface PersistedSnapshot {
  id: "latest";
  updatedAt: string;
  payload: DashboardDataset;
}

export interface PersistedConfig {
  id: "kobo-config";
  baseUrl: string;
  assetUid: string;
  token: string;
}

class DashboardDb extends Dexie {
  snapshots!: Table<PersistedSnapshot, string>;
  configs!: Table<PersistedConfig, string>;

  constructor() {
    super("ise2_dashboard_db");
    this.version(1).stores({
      snapshots: "id, updatedAt",
      configs: "id"
    });
  }
}

export const db = new DashboardDb();

export async function saveSnapshot(payload: DashboardDataset): Promise<void> {
  await db.snapshots.put({
    id: "latest",
    updatedAt: new Date().toISOString(),
    payload
  });
}

export async function loadSnapshot(): Promise<PersistedSnapshot | undefined> {
  return db.snapshots.get("latest");
}

export async function saveConfig(config: Omit<PersistedConfig, "id">): Promise<void> {
  await db.configs.put({ id: "kobo-config", ...config });
}

export async function loadConfig(): Promise<PersistedConfig | undefined> {
  return db.configs.get("kobo-config");
}
