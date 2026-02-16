# ISE2 Logistics Margin Dashboard

Application web locale (Next.js + TypeScript) pour importer les soumissions Kobo/ODK, analyser les marges de transport d'achat, et contrôler la cohérence géographique des collectes terrain.

## Objectif
- Suivre la progression de collecte (objectif 5 enquêtes).
- Calculer les indicateurs de marge (`C05b` / `cmd_montant_transport`).
- Comparer les coûts par type de fournisseur et unité de mesure.
- Vérifier l'intégrité GPS entre position théorique commerçant et position réelle enquêteur (seuil strict 50 m).
- Conserver les données localement (IndexedDB) pour éviter les réimports.

## Fonctionnalités principales
- Import KoboToolbox via URL + Token API + Form ID (Asset UID).
- Dashboard KPI (collecte, marges, taux de complétion, transport facturé).
- Graphiques analytiques (fournisseur, unité).
- Carte GPS de collecte.
- Carte comparative GPS (théorique vs réel) + journal d'audit.
- Sauvegarde et restauration locale des snapshots.
- Thème Studio / Executive.

## Stack technique
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Framer Motion
- Recharts
- React Leaflet + Leaflet
- Dexie (IndexedDB)
- Shadcn-style UI primitives

## Prérequis
- Node.js `20.x` (recommandé)
- `pnpm` installé

Le projet est configuré pour `>=20 <24`.

## Installation
```bash
cd ise2-dashboard
nvm use 20
pnpm install
```

## Configuration
Créer `.env.local` (ou copier `.env.local.example`) :

```env
KOBO_BASE_URL='https://kc.kobotoolbox.org'
KOBO_FORM_ID='votre_asset_uid'
KOBO_API_TOKEN='votre_token_api'
```

Variables optionnelles côté client :

```env
NEXT_PUBLIC_KOBO_BASE_URL='https://kc.kobotoolbox.org'
NEXT_PUBLIC_KOBO_FORM_ID='votre_asset_uid'
```

## Lancement
```bash
pnpm dev
```

Serveur local : `http://127.0.0.1:3000`

## Scripts utiles
- `pnpm dev` : démarrage dev.
- `pnpm dev:clean` : supprime `.next` puis démarre.
- `pnpm reset:dev` : nettoyage complet cache dev puis démarre.
- `pnpm clean` : supprime les caches de build/dev.
- `pnpm lint` : lint ESLint.
- `pnpm build` : build production.

## Structure du projet
```text
app/
  api/kobo/submissions/route.ts    # Import Kobo + normalisation
  page.tsx                         # Dashboard principal
components/
  dashboard/                       # KPI, graphiques, cartes, audit
  import/                          # Formulaire de config API
hooks/
  use-kobo-dashboard.ts            # Orchestration import/snapshot
lib/
  analytics/                       # KPI, marges, distance Haversine
  db/                              # IndexedDB (Dexie)
  kobo/                            # Normalisation des soumissions
types/                             # Contrats de données TS
resources/                         # Référentiels de collecte (voir ci-dessous)
CONCEPTION.md
DEVELOPMENT_LOG.md
```

## Référentiels inclus
Le dossier `resources/` contient :
- `commercants.csv`
- `referentiel_decoupage_administratif_senegal.xlsx`
- `questionnaire_collecte_couts_logistiques.xlsx`

Ces fichiers servent de base au flux de collecte mobile et à la cohérence des analyses desktop.

## Flux de données (résumé)
1. L'utilisateur configure Kobo (URL/token/form).
2. L'API locale récupère les soumissions Kobo paginées.
3. Les enregistrements sont normalisés (compatibilité anciens et nouveaux noms de variables).
4. Les indicateurs sont calculés.
5. Le dashboard affiche KPIs, graphiques, cartes et journal d'audit.
6. Le snapshot peut être sauvegardé en local.

## Contrôle d'intégrité GPS (50 m)
- Distance calculée par formule de Haversine.
- Statuts :
  - `SUCCESS` : distance <= 50 m (position conforme)
  - `CRITICAL` : distance > 50 m (écart détecté)
  - `MISSING` : coordonnées incomplètes
- Si `gps_theorique` est absent dans la soumission, un fallback est appliqué depuis le référentiel commerçants CSV (clé `id_commercant`).

## Dépannage rapide
- Erreur `Cannot find module './xxx.js'` en dev :
  1. stoppe tous les serveurs Next actifs,
  2. `pnpm reset:dev`,
  3. hard refresh navigateur.
- Erreur de chunks CSS/JS :
  - vider le cache `.next` via `pnpm clean`.
- Aucun résultat après import :
  - vérifier URL/token/form ID,
  - vérifier que les soumissions existent sur Kobo,
  - vérifier les noms de variables du formulaire publié.

## Documentation interne
- `CONCEPTION.md` : architecture et choix techniques.
- `DEVELOPMENT_LOG.md` : historique des étapes et correctifs.
