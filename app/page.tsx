"use client";

import { motion } from "framer-motion";
import { Activity, MapPinned } from "lucide-react";
import { MarginKpisCards } from "@/components/dashboard/margin-kpis";
import { GeoMap } from "@/components/dashboard/geo-map";
import { SupplierCostChart } from "@/components/dashboard/supplier-cost-chart";
import { SurveyProgressCards } from "@/components/dashboard/survey-progress-cards";
import { UnitCostChart } from "@/components/dashboard/unit-cost-chart";
import { ApiConfigForm } from "@/components/import/api-config-form";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKoboDashboard } from "@/hooks/use-kobo-dashboard";

export default function HomePage(): JSX.Element {
  const {
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
  } = useKoboDashboard();

  const hasData = dataset.rows.length > 0;

  return (
    <AppShell>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-3"
      >
        <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          ISE2 - Application locale desktop
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Dashboard des marges de transport d&apos;achat
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Importez les soumissions KoboToolbox, suivez la progression des 5 enquetes attendues,
          analysez automatiquement `C05b` et visualisez les points GPS collectes.
        </p>
      </motion.header>

      <ApiConfigForm
        baseUrl={config.baseUrl}
        token={config.token}
        assetUid={config.assetUid}
        loading={loading}
        saving={saving}
        statusMessage={statusMessage}
        errorMessage={error}
        onChange={setConfig}
        onImport={importFromKobo}
        onSaveLocal={saveCurrentSnapshot}
        onLoadLocal={loadLocalSnapshot}
      />

      <SurveyProgressCards
        completion={analytics.completion}
        withTransportCount={dataset.withTransportCount}
      />

      <MarginKpisCards kpis={analytics.kpis} />

      {hasData ? (
        <section className="grid gap-5 xl:grid-cols-2">
          <SupplierCostChart data={analytics.bySupplier} />
          <UnitCostChart data={analytics.byUnit} />
        </section>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-4 w-4 text-accent" />
              Aucun jeu de donnees analytiques disponible
            </CardTitle>
            <CardDescription>
              Lancez un import Kobo ou chargez une sauvegarde locale pour remplir les graphiques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              La carte, les KPI et les aggregations par fournisseur/unite apparaitront des que le
              premier lot de soumissions sera traite.
            </p>
          </CardContent>
        </Card>
      )}

      {analytics.geoPoints.length > 0 ? (
        <GeoMap points={analytics.geoPoints} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPinned className="h-4 w-4 text-accent" />
              Carte en attente de coordonnees GPS
            </CardTitle>
            <CardDescription>
              Aucun point detecte dans les champs `ent_gps` ou `localisation`.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </AppShell>
  );
}
