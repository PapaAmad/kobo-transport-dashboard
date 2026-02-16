"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Database,
  MapPinned,
  Moon,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Sun
} from "lucide-react";
import { GeoAuditJournal } from "@/components/dashboard/geo-audit-journal";
import { GeoComparisonMap } from "@/components/dashboard/geo-comparison-map";
import { MarginKpisCards } from "@/components/dashboard/margin-kpis";
import { GeoMap } from "@/components/dashboard/geo-map";
import { SupplierCostChart } from "@/components/dashboard/supplier-cost-chart";
import { SurveyProgressCards } from "@/components/dashboard/survey-progress-cards";
import { UnitCostChart } from "@/components/dashboard/unit-cost-chart";
import { VerificationBadge } from "@/components/dashboard/verification-badge";
import { ApiConfigForm } from "@/components/import/api-config-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKoboDashboard } from "@/hooks/use-kobo-dashboard";
import { cn } from "@/lib/utils/cn";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06
    }
  }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.2, 0.8, 0.2, 1]
    }
  }
};

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

  const [themeMode, setThemeMode] = useState<"studio" | "executive">("studio");
  const isExecutive = themeMode === "executive";

  const hasData = dataset.rows.length > 0;
  const hasAuditData = analytics.auditLogs.length > 0;
  const transportRate =
    dataset.totalSubmissions === 0
      ? 0
      : (dataset.withTransportCount / dataset.totalSubmissions) * 100;

  return (
    <AppShell theme={themeMode}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        <motion.section variants={sectionVariants} className="grid items-stretch gap-5 xl:grid-cols-[1.4fr_1fr]">
          <header className="panel-glass metric-glow relative overflow-hidden rounded-3xl border border-accent/20 p-7 sm:p-8">
            <div className="absolute -right-14 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-14 left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  ISE2 - Analytics Studio
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setThemeMode(isExecutive ? "studio" : "executive")}
                  className="rounded-full"
                >
                  {isExecutive ? (
                    <>
                      <Sun className="h-4 w-4" />
                      Mode Studio
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      Mode Executive
                    </>
                  )}
                </Button>
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Dashboard des marges de transport d&apos;achat
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                Importez les soumissions KoboToolbox, suivez la progression des 5 enquetes requises,
                analysez automatiquement le montant `C05b` et visualisez les points GPS collectes.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-full border border-border/70 bg-card/65 px-3 py-1 text-xs font-medium text-foreground/90">
                  Persistance locale IndexedDB
                </div>
                <div className="rounded-full border border-border/70 bg-card/65 px-3 py-1 text-xs font-medium text-foreground/90">
                  Analyse fournisseur + unite
                </div>
                <div className="rounded-full border border-border/70 bg-card/65 px-3 py-1 text-xs font-medium text-foreground/90">
                  Carte GPS interactive
                </div>
              </div>
            </div>
          </header>

          <Card
            className={cn(
              "h-full backdrop-blur-none",
              isExecutive
                ? "bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white"
                : "bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900"
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Snapshot en direct
                <Database className={cn("h-5 w-5", isExecutive ? "text-cyan-300" : "text-blue-600")} />
              </CardTitle>
              <CardDescription className={cn(isExecutive ? "text-cyan-100/90" : "text-slate-600")}>
                Vue instantanee du dernier lot de donnees charge.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className={cn("rounded-2xl border p-4", isExecutive ? "border-white/15 bg-white/12" : "border-slate-200 bg-white/80")}>
                <p className={cn("text-xs uppercase tracking-wide", isExecutive ? "text-white/85" : "text-slate-500")}>Lignes analytiques</p>
                <p className="mt-2 text-2xl font-semibold">{dataset.rows.length}</p>
              </div>
              <div className={cn("rounded-2xl border p-4", isExecutive ? "border-white/15 bg-white/12" : "border-slate-200 bg-white/80")}>
                <p className={cn("text-xs uppercase tracking-wide", isExecutive ? "text-white/85" : "text-slate-500")}>Marge moyenne</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(analytics.kpis.average)}</p>
              </div>
              <div className={cn("rounded-2xl border p-4", isExecutive ? "border-white/15 bg-white/12" : "border-slate-200 bg-white/80")}>
                <p className={cn("text-xs uppercase tracking-wide", isExecutive ? "text-white/85" : "text-slate-500")}>Taux completion</p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatPercent(analytics.completion.completionRate)}
                </p>
              </div>
              <div className={cn("rounded-2xl border p-4", isExecutive ? "border-white/15 bg-white/12" : "border-slate-200 bg-white/80")}>
                <p className={cn("text-xs uppercase tracking-wide", isExecutive ? "text-white/85" : "text-slate-500")}>Transport facture</p>
                <p className="mt-2 text-2xl font-semibold">{formatPercent(transportRate)}</p>
              </div>
              <div className={cn("rounded-2xl border p-4 sm:col-span-2", isExecutive ? "border-white/15 bg-white/12" : "border-slate-200 bg-white/80")}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={cn("text-xs uppercase tracking-wide", isExecutive ? "text-white/85" : "text-slate-500")}>
                    Controle geographique (50m)
                  </p>
                  <VerificationBadge
                    status={analytics.geoAudit.criticalCount > 0 ? "critical" : "success"}
                    label={analytics.geoAudit.criticalCount > 0 ? "Alerte active" : "Conforme"}
                  />
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {formatNumber(analytics.geoAudit.checked)} verifiees
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={sectionVariants}>
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
        </motion.section>

        <motion.section variants={sectionVariants} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Collecte</h2>
            <p className="text-sm text-muted-foreground">
              Suivi de progression des enquetes et statut du transport facture.
            </p>
          </div>
          <SurveyProgressCards
            completion={analytics.completion}
            withTransportCount={dataset.withTransportCount}
          />
        </motion.section>

        <motion.section variants={sectionVariants} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Analyse des marges</h2>
            <p className="text-sm text-muted-foreground">
              Lecture des couts moyens et distribution par fournisseur et unite.
            </p>
          </div>
          <MarginKpisCards kpis={analytics.kpis} />
        </motion.section>

        <motion.section variants={sectionVariants} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Controle d&apos;integrite GPS
            </h2>
            <p className="text-sm text-muted-foreground">
              Verification stricte de coherence entre position theorique et position reelle (seuil 50 m).
            </p>
          </div>
          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  Verifications valides
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-semibold text-foreground">{analytics.geoAudit.successCount}</p>
                <VerificationBadge status="success" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  Ecarts critiques
                  <ShieldX className="h-4 w-4 text-rose-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-semibold text-foreground">{analytics.geoAudit.criticalCount}</p>
                <Badge className="w-fit bg-rose-500/15 text-rose-700">
                  {formatPercent(analytics.geoAudit.criticalRate)} des controles
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  Dossiers incomplets
                  <AlertTriangle className="h-4 w-4 text-slate-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-semibold text-foreground">{analytics.geoAudit.missingCount}</p>
                <VerificationBadge status="missing" />
              </CardContent>
            </Card>
          </section>
        </motion.section>

        <motion.section variants={sectionVariants}>
          {hasData ? (
            <section className="grid gap-5 xl:grid-cols-2">
              <SupplierCostChart data={analytics.bySupplier} />
              <UnitCostChart data={analytics.byUnit} />
            </section>
          ) : (
            <Card className="border-dashed">
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
                  La carte, les KPI et les aggregations par fournisseur/unite apparaitront des que
                  le premier lot de soumissions sera traite.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.section>

        <motion.section variants={sectionVariants}>
          {hasAuditData ? (
            <section className="space-y-5">
              <GeoComparisonMap entries={analytics.comparisonPoints} />
              <GeoAuditJournal logs={analytics.auditLogs} thresholdMeters={analytics.geoAudit.thresholdMeters} />
            </section>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPinned className="h-4 w-4 text-accent" />
                  Audit GPS en attente
                </CardTitle>
                <CardDescription>
                  Aucun enregistrement avec `gps_theorique` ou `position_reelle` n&apos;a encore ete importe.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </motion.section>

        <motion.section variants={sectionVariants}>
          {analytics.geoPoints.length > 0 ? (
            <GeoMap points={analytics.geoPoints} />
          ) : (
            <Card className="border-dashed">
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
        </motion.section>
      </motion.div>
    </AppShell>
  );
}
