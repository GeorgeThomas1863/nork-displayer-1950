# Admin Table Sort Redesign — Design Spec

**Date:** 2026-07-26
**Scope:** KCNA Scrape Monitor table on `/admin` — capped row count, server-side sorting, backend-computed stats.

## Problem

The admin log table loads up to 500 rows in natural insertion order (oldest first) with no default sort. Column clicks sort client-side over the fetched rows only, first click is always ascending, and sort state resets on every display refresh (including the automatic refresh 3s after each command). The four non-log collections each ship up to 500 full documents per refresh that the frontend never reads — only their counts are used.

## Behavior (after)

- Table shows at most `DEFAULT_LOAD_LOG` rows (env var, set to 100; hard fallback to 100 when unset or invalid).
- Default sort: `scrapeEndTime` descending (newest first). MongoDB sorts null/missing last on descending, so still-active scrapes (no end time) appear at the bottom.
- Clicking a column header triggers a new backend lookup: the **whole** log collection is sorted server-side and the top `DEFAULT_LOAD_LOG` rows returned. Clicking the same column toggles asc/desc; clicking a new column starts ascending (existing semantics), except the initial page state which is endTime/desc.
- Sort state persists across display refreshes: the current column/direction is sent with every admin data request, so auto-refresh no longer resets the user's sort.
- Sort icons reflect the active column/direction after every table rebuild.
- Record count reads `{shown} of {total} Records` using the collection count.
- Stats bar (Total / Active / Completed / Errors / Avg Time) is computed on the backend over the **full** log collection via one aggregation — no longer derived from visible rows.
- Clicking the ▼ icon inside a header sorts correctly (currently misses because `e.target` is the icon span, not the `th`).

## API contract

`POST /nork-admin-data-route` — body gains two optional fields:

```json
{ "sortColumn": "endTime", "sortDir": "desc" }
```

- `sortColumn` whitelist: `id | status | startTime | endTime | duration | step | message | active`
- `sortDir` whitelist: `asc | desc`
- Anything missing or invalid falls back to `endTime` / `desc`. Validation lives in `adminDataController`; client strings never reach a Mongo sort directly.

**Response** keeps the existing array-of-collections shape. Changes:

- The `log` entry: `{ collection: "log", count, data: [≤100 sorted rows], stats: { activeScrapes, finishedScrapes, errorScrapes, avgDuration } }`
- The other four entries: `{ collection, count }` — no `data` payload (frontend already defaults missing `data` to `[]`).

## Column → Mongo sort mapping (backend)

| Column | Sort spec |
|---|---|
| id | `{ _id: dir }` |
| status | `{ scrapeError: dir, scrapeActive: dir, _id: dir }` (compound approximation; no aggregation) |
| startTime | `{ scrapeStartTime: dir, _id: dir }` |
| endTime | `{ scrapeEndTime: dir, _id: dir }` |
| duration | `{ scrapeLengthSeconds: dir, _id: dir }` |
| step | `{ scrapeStep: dir, _id: dir }` |
| message | `{ scrapeMessage: dir, _id: dir }` |
| active | `{ scrapeActive: dir, _id: dir }` |

`_id` tiebreaker keeps ordering deterministic across refreshes.

## Changes by file

**Backend**

- `models/db-model.js`
  - `getSortedItemsArray()` — reads `{ sortObj, howMany }` from `this.dataObject`; runs `find().sort(sortObj).limit(howMany).toArray()`. Takes a prebuilt sort object so the compound status sort needs no special case.
  - `getLogStatsSummary()` — single aggregation over the collection producing `activeScrapes` (scrapeActive true), `finishedScrapes` (scrapeEndTime set and scrapeError not true), `errorScrapes` (scrapeError true), `avgDuration` (average of non-null `scrapeLengthSeconds`, rounded). Wrapped in the same try/catch conventions as the rest of the model's callers.
- `src/admin-back.js`
  - `runGetAdminData(sortParams)` — builds the Mongo sort object from the validated column/direction; `log` uses `getSortedItemsArray` with `howMany = +process.env.DEFAULT_LOAD_LOG || 100` (matching the existing `DEFAULT_LOAD_*` read pattern, with a hard fallback of 100 when the env var is unset or invalid) plus `getLogStatsSummary`; the other four collections call `countAll()` only.
- `controllers/data-controller.js`
  - `adminDataController` — validates `sortColumn`/`sortDir` against the whitelists, passes the sanitized pair to `runGetAdminData`.

**Frontend**

- `public/js/admin/admin-sort-tbl.js` — client-side sorting removed. Module keeps `{ sortColumn, sortDir }` state (initial: `endTime`/`desc`). `runAdminSortColumn(column)` updates state (toggle on repeat click) and calls `updateAdminDisplay()`. Exports a getter for the current state and `applySortIcons()` to stamp the active header icon after each rebuild. `setAdminTableData`/`sortTableData`/`getStatusValue` deleted.
- `public/js/admin.js` — `updateAdminDisplay()` includes the current sort state in the POST body.
- `public/js/admin/admin-return.js` — stats bar reads `stats` from the log entry instead of computing via `buildLogStats` (deleted); record count becomes `{data.length} of {count} Records`; after the table is built, `applySortIcons()` is called so the header shows the active sort. The `setAdminTableData` call and `rebuildAdminTableBody` (both only served the old client-side sort path) are removed.
- `public/js/admin/admin-responsive.js` — `clickHandler` resolves the column via `e.target.closest("th[data-column]")` so icon clicks register; the dead per-header listener wiring at module load (headers don't exist yet at that point) is removed.

**Config / docs**

- `.env` — user adds `DEFAULT_LOAD_LOG=100` (file is access-restricted to the assistant). The code fallback means the app still works at 100 without it.
- `CLAUDE.md` — add `DEFAULT_LOAD_LOG` to the documented `.env` variables.

**Tests**

- `tests/backend/admin-back.test.js` — update for count-only collections, sorted+capped log query, stats summary, sort-object construction (incl. status compound sort and default fallback).
- `tests/controllers/data-controller.test.js` — whitelist validation: valid pair passes through, invalid/missing falls back to `endTime`/`desc`.
- Existing frontend tests don't cover the sort table; no changes expected there.

## Explicitly out of scope

- No pagination (single capped page only).
- No aggregation-ranked status sort (compound field sort approximation accepted).
- No Mongo index changes — top-100 sort on a small-document log collection is well within in-memory sort limits at current scale.

## Error handling

Unchanged paths reused: per-collection try/catch in `admin-back.js` returns `null` → controller sends the existing 503 failure shape → frontend renders the existing error display. Aggregation failure is caught the same way as the collection queries.
