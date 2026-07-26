# Admin Table Sort Redesign — Implementation Plan

**Spec:** `docs/superpowers/specs/2026-07-26-admin-table-sort-design.md`
**Branch:** master (user rule: no worktrees, no branches).

## Global Constraints

- **Never commit.** Leave all changes in the working tree. The user owns all commits.
- ESM modules throughout (`import`/`export`), Express v5 backend, vanilla JS frontend (no frameworks, no bundler).
- Code style: one function = one job named as a verb phrase; guard clauses at top; max 2 nesting levels; `for` loops instead of `.forEach`/`.map`/`.filter`/`.reduce` unless there is a specific reason; wrap external calls (DB, network) in try/catch with contextual `console.error`; queries return data or null; no speculative code or single-use abstractions. Match the surrounding code's comment density and naming.
- **API contract** (binding, both tasks): `POST /nork-admin-data-route` body fields `sortColumn` and `sortDir`, both optional. `sortColumn` whitelist: `id | status | startTime | endTime | duration | step | message | active`. `sortDir` whitelist: `asc | desc`. Missing/invalid → fall back to `endTime` / `desc`.
- **Response shape** (binding, both tasks): array of per-collection objects. Log entry: `{ collection: "log", count, data: [sorted rows], stats: { activeScrapes, finishedScrapes, errorScrapes, avgDuration } }`. Other four entries (`articles`, `pics`, `picSets`, `vidPages`): `{ collection, count }` — no `data` field.
- Log row cap: `+process.env.DEFAULT_LOAD_LOG || 100` (hard fallback 100 when env var unset/invalid).
- Every Mongo sort object ends with an `_id` tiebreaker in the same direction. Status column sorts by `{ scrapeError: dir, scrapeActive: dir, _id: dir }`.
- `npm test` (vitest) must pass when the task is done.

## Task 1: Backend — sorted/capped log query, stats aggregation, validated route

Files: `models/db-model.js`, `src/admin-back.js`, `controllers/data-controller.js`, `tests/backend/admin-back.test.js`, `tests/controllers/data-controller.test.js`, `CLAUDE.md`.

1. `models/db-model.js` — add two methods following the existing class style:
   - `getSortedItemsArray()` — reads `{ sortObj, howMany }` from `this.dataObject`; runs `find().sort(sortObj).limit(howMany).toArray()` via `dbGet()`, same pattern as the existing get methods. Takes a prebuilt sort object so the compound status sort needs no special case.
   - `getLogStatsSummary()` — one aggregation over the collection returning `{ activeScrapes, finishedScrapes, errorScrapes, avgDuration }`:
     - `activeScrapes`: count of docs where `scrapeActive` is `true`
     - `errorScrapes`: count of docs where `scrapeError` is `true` (use `{$eq: ["$scrapeError", true]}`-style conditions so missing fields count as false)
     - `finishedScrapes`: count of docs where `scrapeEndTime` is non-null AND `scrapeError` is not `true` (`{$gt: ["$scrapeEndTime", null]}` is the idiom for non-null in aggregation)
     - `avgDuration`: `$avg` of `scrapeLengthSeconds` (Mongo `$avg` ignores null/missing), rounded to an integer, `0` when the collection is empty or no durations exist
     - Return the plain summary object (no `_id`); when the collection is empty the aggregation returns no rows — return zeros.
2. `src/admin-back.js` — rework `runGetAdminData` to accept `{ sortColumn, sortDir }` (already validated by the controller):
   - Build the Mongo sort object from a column→field mapping: `id → _id`, `status → scrapeError, scrapeActive`, `startTime → scrapeStartTime`, `endTime → scrapeEndTime`, `duration → scrapeLengthSeconds`, `step → scrapeStep`, `message → scrapeMessage`, `active → scrapeActive`; direction `asc → 1`, `desc → -1`; append `_id` in the same direction.
   - `log` collection: `countAll()` + `getSortedItemsArray()` with `howMany = +process.env.DEFAULT_LOAD_LOG || 100` + `getLogStatsSummary()` → `{ collection: "log", count, data, stats }`.
   - Other four collections: `countAll()` only → `{ collection, count }`.
   - Keep the existing per-collection try/catch → `null` on failure → controller 503 behavior. Remove the now-dead `getAll` usage from this flow (leave `dbModel.getAll` itself alone — do not delete model methods this plan doesn't own).
3. `controllers/data-controller.js` — `adminDataController` validates `req.body.sortColumn` / `req.body.sortDir` against the whitelists (Global Constraints) with fallback to `endTime`/`desc`, passes the sanitized pair to `runGetAdminData`. Follow the file's existing small-helper validation style.
4. `CLAUDE.md` — add `DEFAULT_LOAD_LOG` to the documented `DEFAULT_LOAD_*` env vars line.
5. Tests — update `tests/backend/admin-back.test.js` and `tests/controllers/data-controller.test.js` to match (read them first; follow their existing mocking style):
   - admin-back: log returns sorted+capped data with stats; other collections count-only; sort-object construction incl. status compound sort, `_id` tiebreaker, asc/desc; `DEFAULT_LOAD_LOG` fallback to 100 when unset/invalid; failure path still returns null.
   - data-controller: valid pair passes through; invalid/missing falls back to `endTime`/`desc`; non-object body handled.
6. Run `npm test` — full suite green.

## Task 2: Frontend — server-driven sort state, icons, stats display

Files: `public/js/admin/admin-sort-tbl.js`, `public/js/admin.js`, `public/js/admin/admin-return.js`, `public/js/admin/admin-responsive.js`.

Consumes the Task 1 API contract (see Global Constraints). Backend is already done.

1. `public/js/admin/admin-sort-tbl.js` — rewrite:
   - Module state `{ sortColumn: "endTime", sortDir: "desc" }` (the default view).
   - `runAdminSortColumn(column)` — same column → toggle direction; new column → that column, `"asc"`; then `await updateAdminDisplay()`. No client-side sorting.
   - Export `getAdminSortState()` returning `{ sortColumn, sortDir }`.
   - Export `applySortIcons(tableElement)` — operates on the **passed element** (not `document` — the table is built detached before being appended): reset all header icons to `▼` / opacity 0.3, then set the active column's icon (`▲` asc / `▼` desc, opacity 1) from module state.
   - Delete `setAdminTableData`, `sortTableData`, `getStatusValue`, the old `updateSortIcons`, and the `rebuildAdminTableBody` import. (The ESM import cycle admin.js ↔ admin-sort-tbl.js is fine — calls happen post-load, same as the existing pattern.)
2. `public/js/admin.js` — `updateAdminDisplay()` spreads the current sort state into the POST body: `{ route: "/nork-admin-data-route", ...getAdminSortState() }`.
3. `public/js/admin/admin-return.js`:
   - Stats bar: read `stats` from the log entry (`getAdminCollection` must expose it) instead of computing — delete `buildLogStats`. Displayed stats keep the same labels/order; counts for the other collections come from `count` as today.
   - Record count: `` `${data.length} of ${count} Records` `` using the log entry's `count` (pass what's needed into `buildAdminTableContainer` — it currently only receives the rows array).
   - After building the table, call `applySortIcons` on the built table element.
   - Remove the `setAdminTableData` call and delete `rebuildAdminTableBody`.
4. `public/js/admin/admin-responsive.js`:
   - `clickHandler` resolves the sort column via `e.target.closest("th[data-column]")` so clicks on the ▼ icon span register.
   - Delete the dead per-header listener wiring at module load (bottom of file — those headers don't exist yet at module-load time; delegation on `adminDisplayElement` handles it).
5. Run `npm test` — full suite green (no existing frontend tests cover these admin modules; nothing should break).

## Verification

Final whole-branch review of the combined diff against the spec, then `npm test`.
