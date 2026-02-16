"use client";

import { DatabaseZap, DownloadCloud, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiConfigFormProps {
  baseUrl: string;
  token: string;
  assetUid: string;
  loading: boolean;
  saving: boolean;
  statusMessage: string;
  errorMessage: string;
  onChange: (next: { baseUrl: string; token: string; assetUid: string }) => void;
  onImport: () => Promise<void>;
  onSaveLocal: () => Promise<void>;
  onLoadLocal: () => Promise<void>;
}

export function ApiConfigForm({
  baseUrl,
  token,
  assetUid,
  loading,
  saving,
  statusMessage,
  errorMessage,
  onChange,
  onImport,
  onSaveLocal,
  onLoadLocal
}: ApiConfigFormProps): JSX.Element {
  const hasError = Boolean(errorMessage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <DatabaseZap className="h-5 w-5 text-accent" />
            Centre de synchronisation KoboToolbox
          </CardTitle>
          <CardDescription>
            Renseignez l&apos;URL, le token API et l&apos;ID du formulaire. En l&apos;absence de configuration,
            ces champs sont obligatoires.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="base-url">URL Kobo</Label>
              <Input
                id="base-url"
                placeholder="https://kc.kobotoolbox.org"
                value={baseUrl}
                onChange={(event) =>
                  onChange({ baseUrl: event.target.value, token, assetUid })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-token">Token API</Label>
              <Input
                id="api-token"
                type="password"
                placeholder="Token Kobo"
                value={token}
                onChange={(event) =>
                  onChange({ baseUrl, token: event.target.value, assetUid })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-uid">ID formulaire Kobo</Label>
              <Input
                id="asset-uid"
                placeholder="aePFsfgka3SLkt3UCJkjZ9"
                value={assetUid}
                onChange={(event) =>
                  onChange({ baseUrl, token, assetUid: event.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={onImport} disabled={loading}>
              <DownloadCloud className="h-4 w-4" />
              {loading ? "Import en cours..." : "Importer depuis Kobo"}
            </Button>
            <Button variant="secondary" onClick={onSaveLocal} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Sauvegarde..." : "Sauvegarder en local"}
            </Button>
            <Button variant="ghost" onClick={onLoadLocal}>
              Charger les donnees locales
            </Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/80 bg-card/60 p-4 md:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-muted/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Source</p>
              <p className="mt-1 text-sm font-medium text-foreground">Kobo API v2</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Mode</p>
              <p className="mt-1 text-sm font-medium text-foreground">Import manuel + cache local</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Persistance</p>
              <p className="mt-1 text-sm font-medium text-foreground">IndexedDB (Dexie)</p>
            </div>
          </div>

          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              hasError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-100 bg-emerald-50 text-emerald-800"
            }`}
          >
            <p>{statusMessage}</p>
            {errorMessage ? <p className="mt-1 text-red-700">{errorMessage}</p> : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
