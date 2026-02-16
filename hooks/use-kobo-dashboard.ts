"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchKoboSubmissions } from "@/lib/api/kobo-client";
import { buildDashboardAnalytics } from "@/lib/analytics/margins";
import {
  loadConfig,
  loadSnapshot,
  saveConfig,
  saveSnapshot
} from "@/lib/db/dexie";
import { DashboardDataset } from "@/types/survey";
import { DashboardAnalytics } from "@/types/analytics";

const EMPTY_DATASET: DashboardDataset = {
  rows: [],
  totalSubmissions: 0,
  withTransportCount: 0
};

interface KoboConfigState {
  baseUrl: string;
  token: string;
  assetUid: string;
}

const DEFAULT_CONFIG: KoboConfigState = {
  baseUrl: process.env.NEXT_PUBLIC_KOBO_BASE_URL ?? "https://kc.kobotoolbox.org",
  token: "",
  assetUid: process.env.NEXT_PUBLIC_KOBO_FORM_ID ?? "aePFsfgka3SLkt3UCJkjZ9"
};

export interface UseKoboDashboardResult {
  config: KoboConfigState;
  setConfig: (next: KoboConfigState) => void;
  dataset: DashboardDataset;
  analytics: DashboardAnalytics;
  loading: boolean;
  saving: boolean;
  error: string;
  statusMessage: string;
  importFromKobo: () => Promise<void>;
  saveCurrentSnapshot: () => Promise<void>;
  loadLocalSnapshot: () => Promise<void>;
}

export function useKoboDashboard(): UseKoboDashboardResult {
  const [config, setConfigState] = useState<KoboConfigState>(DEFAULT_CONFIG);
  const [dataset, setDataset] = useState<DashboardDataset>(EMPTY_DATASET);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("Aucune importation effectuée.");

  const analytics = useMemo(() => buildDashboardAnalytics(dataset), [dataset]);

  const setConfig = useCallback((next: KoboConfigState) => {
    setConfigState(next);
  }, []);

  const hydrateLocal = useCallback(async () => {
    const [storedSnapshot, storedConfig] = await Promise.all([loadSnapshot(), loadConfig()]);

    if (storedSnapshot?.payload) {
      setDataset(storedSnapshot.payload);
      setStatusMessage(`Données locales chargées (${new Date(storedSnapshot.updatedAt).toLocaleString()}).`);
    }

    if (storedConfig) {
      setConfigState({
        baseUrl: storedConfig.baseUrl,
        token: storedConfig.token,
        assetUid: storedConfig.assetUid
      });
    }
  }, []);

  useEffect(() => {
    void hydrateLocal();
  }, [hydrateLocal]);

  const importFromKobo = useCallback(async () => {
    if (!config.baseUrl || !config.token || !config.assetUid) {
      setError("URL Kobo, token API et ID formulaire sont obligatoires.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await fetchKoboSubmissions(config);
      setDataset(result.dataset);
      setStatusMessage(
        `Import réussi: ${result.totalRaw} soumissions brutes, ${result.dataset.rows.length} lignes analytiques.`
      );
      await saveConfig({ ...config });
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import Kobo impossible.");
    } finally {
      setLoading(false);
    }
  }, [config]);

  const saveCurrentSnapshot = useCallback(async () => {
    setSaving(true);
    setError("");
    try {
      await Promise.all([saveSnapshot(dataset), saveConfig({ ...config })]);
      setStatusMessage("Snapshot sauvegardé en local.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Sauvegarde locale impossible.");
    } finally {
      setSaving(false);
    }
  }, [config, dataset]);

  const loadLocalSnapshot = useCallback(async () => {
    setError("");
    try {
      const storedSnapshot = await loadSnapshot();
      if (!storedSnapshot?.payload) {
        setStatusMessage("Aucune donnée locale disponible.");
        return;
      }
      setDataset(storedSnapshot.payload);
      setStatusMessage(`Snapshot local restauré (${new Date(storedSnapshot.updatedAt).toLocaleString()}).`);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Chargement local impossible.");
    }
  }, []);

  return {
    config,
    setConfig,
    dataset,
    analytics,
    loading,
    saving,
    error,
    statusMessage,
    importFromKobo,
    saveCurrentSnapshot,
    loadLocalSnapshot
  };
}
