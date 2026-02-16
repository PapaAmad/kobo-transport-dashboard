# CONCEPTION - ISE2 Transport Margin Desktop Web App

## 1) Goal
Build a local-first analytical dashboard for Kobo survey data on transport purchase margins.

Core goals:
- Import Kobo data through API credentials.
- Track collection progress toward 5 required surveys.
- Analyze transport amount field (`C05b` / `cmd_montant_transport`) by supplier type and unit.
- Display GPS points when available.
- Enforce a strict geographic integrity check between expected merchant location and real collector position.
- Persist data locally to avoid repeated API calls.

## 2) Technical Architecture
- Framework: Next.js 14 App Router + TypeScript strict mode.
- UI: Tailwind + shadcn-style primitives + Framer Motion.
- Charts: Recharts.
- Local persistence: Dexie (IndexedDB).
- Map: React Leaflet.

### Layers
1. `app/`:
- UI entry and server API route.

2. `components/`:
- Composable dashboard modules (import form, KPIs, charts, map).

3. `lib/kobo`:
- Kobo raw payload normalization (support old and v2 variable names).

4. `lib/analytics`:
- Margin KPIs, grouped series, completion metrics, Haversine distance audit.

5. `lib/db`:
- IndexedDB schema and local save/load.

6. `types/`:
- Shared contract for raw/normalized/analytic records.

## 3) Data Model

### Raw Kobo Submission
- Flexible object with unknown shape.
- Support both naming schemes:
  - Old: `C05b`, `C04`, `C03b`, `localisation`, `SectionCrepeat1`, `SectionCrepeat2`
  - V2: `cmd_montant_transport`, `cmd_fournisseur_type`, `prd_unite`, `ent_gps`, `cmd_repeat`, `prd_repeat`

### Normalized Rows (analysis rows)
Each row represents one product line within one command context:
- `submissionId`
- `marginAmount`
- `supplierType`
- `unitLabel`
- `gps` (lat/lng optional)

### Geo Integrity Audit (per submission)
- `commercantId`
- `commercantLabel`
- `expectedGps` (from `gps_theorique` / CSV location)
- `actualGps` (from `position_reelle`)
- `distanceMeters` (Haversine)
- `status` (`success`, `critical`, `missing`)
- `message` (quality-control log line)

Assumption:
- When one command contains multiple products but a single transport amount, amount is associated with each product line for unit-level aggregation.

## 4) User Flow
1. User opens app.
2. App loads last local snapshot from IndexedDB if available.
3. User enters Kobo URL, token, and form ID.
4. User clicks "Importer".
5. Route handler fetches submissions from Kobo API and returns normalized payload.
6. Dashboard cards/charts/map update immediately.
7. GPS integrity module computes expected-vs-real distance with a strict 50m threshold.
8. Audit journal and comparative map highlight conform vs critical records.
9. User clicks "Sauvegarder en local" to persist snapshot.
10. After refresh, snapshot is restored.

## 5) API Strategy
Endpoint default:
- `GET {baseUrl}/api/v2/assets/{assetUid}/data/?format=json`

Server route (`/api/kobo/submissions`) handles:
- token injection in Authorization header,
- pagination (`next` cursor),
- normalization output.

## 6) UX / Design Decisions
- Slate + white palette with royal blue accent.
- Rounded cards (`rounded-2xl`), thin borders, soft shadow.
- Large spacing and section breathing room.
- Subtle gradient background and staggered reveal animations.
- Verification badges use explicit semantic colors:
  - Green = `distance <= 50m` (position conforme).
  - Red = `distance > 50m` (critical discrepancy).
  - Slate = missing coordinates.

## 7) GPS Integrity Rule (50m)
- Distance formula: Haversine with Earth radius = 6,371,000m.
- Threshold: `50 meters`, intentionally strict for field-quality control.
- Why 50m:
  - Limits false positives from normal handset GPS drift while still catching wrong respondent location.
  - Preserves statistical rigor for geo-sensitive analysis on transport margins.
  - Keeps a clear binary decision for audit reporting (`success` vs `critical`).

## 8) Reliability / Validation
- Missing credentials produce explicit inline errors.
- Empty dataset shows clear state with guidance.
- Strict parsing for numeric and geopoint values.
- Compatible with old and refactored field names.
- Legacy snapshots without GPS audit arrays are auto-upgraded in memory.

## 9) Known Constraints
- Map tiles require internet access.
- Without Kobo credentials, import cannot run.
- Typecheck/build requires dependency install.
