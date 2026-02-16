# DEVELOPMENT LOG

## 2026-02-15 - Step 1: Project Initialization
- Created project folder `ise2-dashboard` with Next.js App Router style structure.
- Added TypeScript strict configuration, Tailwind config, ESLint config, env example.
- Added `CONCEPTION.md` before implementation as requested.
- Set Kobo defaults in `.env.local.example` (base URL and form ID), leaving token blank.

Issues:
- None at this stage.

Resolution:
- N/A

## 2026-02-15 - Step 2: Data + API Layer
- Added Kobo server route: `app/api/kobo/submissions/route.ts`.
- Implemented Kobo pagination and API error handling.
- Added normalization layer supporting old and new field names.
- Added analytics layer for completion, KPIs, supplier averages, unit averages.
- Added Dexie persistence layer for snapshot + config.

Issues:
- Kobo payload may vary by variable naming scheme.

Resolution:
- Implemented dual key mapping (`old` and `v2`) in normalization logic.

## 2026-02-15 - Step 3: UI and UX Implementation
- Built dashboard UI cards/charts/map with Tailwind + Recharts + Framer Motion.
- Added import module with Kobo URL/token/form fields.
- Added local persistence actions: save/load local snapshot.
- Added map visualization with React Leaflet (client-side dynamic import).
- Applied visual direction (slate/white/royal blue, rounded cards, whitespace, soft shadows).

Issues:
- Leaflet requires client-only rendering in Next.js.

Resolution:
- Added `dynamic(..., { ssr: false })` map wrapper and separate client map component.

## 2026-02-15 - Step 4: Validation Attempt
- Attempted dependency installation (`npm install`) for lint/build validation.

Issues:
- Installation did not complete in the current environment (likely network-restricted context).

Resolution:
- Delivered full source scaffold and implementation; runtime validation remains to run once dependencies are installable.

## 2026-02-15 - Step 5: Kobo Credentials Bootstrap
- Added local runtime config in `.env.local` using provided Kobo base URL, form ID and API token.
- Added matching public defaults for base URL and form ID to prefill import form.

Issues:
- None.

Resolution:
- N/A

## 2026-02-15 - Step 6: Runtime Fix (Next config)
- Replaced unsupported `next.config.ts` with `next.config.mjs` for Next 14 compatibility.
- Confirmed lint status: no ESLint warnings/errors.

Issues:
- Local sandbox blocked opening port 3000 (`EPERM`) during `pnpm dev` check.

Resolution:
- This is environment-specific; on local machine run `pnpm dev` normally.

## 2026-02-16 - Step 7: Premium UI Refresh ("wow" dashboard)
- Redesigned the hero section into a split layout with a high-contrast live snapshot panel.
- Upgraded visual system: denser gradients, ambient background grid, glass panels, stronger card depth.
- Enhanced import module with richer status cards and better feedback styling.
- Restyled progress/KPI cards with icon capsules, accents, and emphasis hierarchy.
- Improved chart presentation (top-10 focus, gradient bars, premium tooltip style, cleaner axis readability).
- Polished map container and empty states for visual consistency.

Issues:
- Need to preserve readability despite richer visuals.

Resolution:
- Kept muted text hierarchy, spacing, and contrast control while increasing decorative depth.
- Verified no lint issues after redesign.

## 2026-02-16 - Step 8: Dribbble-style V2 polish
- Added visual theme toggle in header: `Mode Studio` / `Mode Executive`.
- Implemented executive dark navy glass theme via CSS variable overrides (`theme-exec`).
- Added section-level stagger reveal animation using Framer Motion container/item variants.
- Enhanced KPI cards with embedded sparkline mini-charts for fast trend perception.
- Updated text and card colors for cross-theme readability.

Issues:
- Ensuring readability in dark mode while keeping vibrant visual accents.

Resolution:
- Replaced fixed slate colors with semantic `foreground/muted` tokens where needed.
- Verified with lint after all changes.

## 2026-02-16 - Step 9: Runtime invalid element fix
- Replaced theme toggle icons with stable aliases (`Sun`, `Moon`) in `app/page.tsx`.
- Re-ran static checks: lint, TypeScript noEmit, production build.

Issues:
- Browser/dev runtime reported `Element type is invalid` from `ClientPageRoot`.

Resolution:
- Applied import hardening in page component and validated successful build pipeline.
- Recommended full dev-server restart + `.next` cleanup to clear Fast Refresh stale cache.

## 2026-02-16 - Step 10: Next chunk cache incident (`Cannot find module './522.js'`)
- Root cause identified as inconsistent `.next` artifacts (dev cache/runtime chunk mismatch).
- Performed clean rebuild: removed `.next` and rebuilt successfully.
- Added safety script `dev:clean` in `package.json` to force clean dev starts.

Operational note:
- Avoid running `next build` while `next dev` is active in another terminal.

## 2026-02-16 - Step 11: Recurrent missing server chunk (`./590.js`) hardening
- Added webpack dev cache override in `next.config.mjs` (`cache: memory`) to reduce on-disk chunk cache corruption.
- Added maintenance scripts in `package.json`:
  - `clean`
  - `reset:dev`
  - existing `dev:clean`
- Added `.nvmrc` (`20`) and `engines.node` constraint (`>=20 <24`) to steer runtime toward stable Node LTS for Next 14.

Issues:
- Repeated runtime chunk miss while using Node v24 with Next 14.

Resolution:
- Hardened dev startup path and documented Node compatibility guardrails.

## 2026-02-16 - Step 12: Studio visual blur fix (Snapshot + Completion)
- Removed subpixel hover translation from global `Card` component to avoid text softening artifacts.
- Disabled backdrop blur on the `Snapshot en direct` card and on `Taux de completion` card.
- Increased contrast of snapshot labels/descriptions in light mode.
- Kept full style parity in executive mode while improving text sharpness.

Validation:
- `pnpm lint` passed.

## 2026-02-16 - Step 13: Studio contrast fix (Snapshot card)
- Root cause: `.panel-glass` used `background` shorthand and overrode gradient utility backgrounds.
- Switched `.panel-glass` / `.theme-exec .panel-glass` to `background-color` to preserve per-card gradients.
- Reworked Snapshot card styles for explicit Studio vs Executive palettes.
- Increased light-mode text contrast in Snapshot KPI mini-panels.

Validation:
- `pnpm lint` passed.

## 2026-02-16 - Step 14: GPS navigation + integrity control (50m)
- XLSForm `survey` GPS navigation block aligned with external CSV selection:
  - `id_commercant` (select_one_from_file),
  - `gps_theorique` (calculate via `instance('commercants').../localisation`),
  - `url_maps` (Google Maps URL calculate),
  - `note_navigation` (markdown route link),
  - `position_reelle` (field geopoint capture).
- Added Haversine distance utility (`calculateDistance`) and strict threshold (`50m`).
- Extended normalized dataset with `geoAudits` per submission (`success`, `critical`, `missing`).
- Added dashboard modules:
  - `VerificationBadge` (status icon/color),
  - GPS integrity KPI cards,
  - comparative Leaflet map (expected vs actual),
  - `Journal d'audit` table with distance and alert message.
- Updated dashboard analytics contracts and backward compatibility for old local snapshots.

Issues:
- External Python package install for XLSX editing (`openpyxl`) unavailable in restricted network context.

Resolution:
- Applied XLSX edits through direct XML update inside `.xlsx` archive while preserving workbook structure.
