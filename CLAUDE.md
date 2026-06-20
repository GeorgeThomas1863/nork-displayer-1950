# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**You are the orchestrator.** Subagents execute. Do NOT build, verify, or code inline where possible — plan, prioritize, and coordinate.

Keep replies extremely concise. Put all screenshots/pics taken with the MCP plugin in `.claude/pics/` in this project.

Do NOT commit anything to GitHub. The user controls all commits. Do not touch Git history or interact with GitHub.

## Commands

```bash
npm start        # Start with nodemon (auto-restarts on changes)
npm test         # Run vitest test suite
```

No lint script in `package.json`.

## Config Setup

All configuration is loaded from a `.env` file in the project root (gitignored). The app will not start without it. `dotenv` is loaded once in `middleware/db-config.js`; all other files access config via `process.env` directly — there is no `CONFIG` object or `middleware/config.js`.

Key `.env` variables:
- `DISPLAY_PORT`, `SCRAPE_PORT` — service ports
- `PW`, `ADMIN_PW` — auth passwords
- `SESSION_SECRET` — express-session secret
- `MONGO_URI`, `DB_NAME` — MongoDB connection
- `COLLECTIONSARR` — comma-separated collection names
- `PIC_PATH`, `VID_PATH`, `WATCH_PATH` — filesystem media paths
- `EXPRESS_PIC_PATH`, `EXPRESS_VID_PATH`, `EXPRESS_WATCH_PATH` — URL prefixes for auth-gated static media
- `DEFAULT_LOAD_ARTICLES`, `DEFAULT_LOAD_PICS`, `DEFAULT_LOAD_PICSETS`, `DEFAULT_LOAD_VIDS`, `DEFAULT_LOAD_VIDPAGES` — default result counts
- `API_SCRAPER` — route on the scraper service to proxy admin commands to
- `API_PASSWORD` — password sent with proxied scraper requests

## Architecture

**Two-service system.** This repo (the displayer) runs on `DISPLAY_PORT` and communicates with a separate scraper service on `SCRAPE_PORT` via HTTP (axios). Admin commands are proxied to the scraper via `src/admin-back.js → runAdminCommand()`.

### Backend (Node.js/Express v5, ESM modules)

```
app.js                    Entry point: session, auth-gated static paths, routes, DB connect
middleware/
  session-config.js       buildSessionConfig() — 24h cookie, httpOnly, secure:auto
  db-config.js            dbConnect() / dbGet() — single MongoDB connection
routes/
  router.js               All route definitions (routes are hardcoded strings, not env vars)
  auth.js                 requireAuth, requireAdminAuth middleware
controllers/
  auth-controller.js      Password check → set session flags
  display-controller.js   Serve static HTML files (index, admin, 401, 404, 500)
  data-controller.js      Bridge HTTP routes to backend logic
src/
  main-back.js            runUpdateDisplayData(), dataLookup() — core dispatch + DB query
  admin-back.js           runAdminCommand() (proxy to scraper), runGetAdminData()
  kcna/
    articles.js           getNewArticles(), buildArticleParams()
    pics.js               getNewPics(), buildPicParams()
    vids.js               getNewVids(), buildVidParams()
models/db-model.js        dbModel class: getNewestItemsArray, getOldestItemsArray,
                          getNewestItemsByTypeArray, getOldestItemsByTypeArray,
                          getAll, getUniqueItem, getUniqueArray, storeAny, storeUniqueURL
```

**Hardcoded API routes:**
- `POST /nork-update-display-data-route` — fetch display data
- `POST /nork-admin-data-route` — get all admin data
- `POST /nork-admin-command-route` — send command to scraper
- `POST /nork-admin-polling-route` — 501 Not Implemented

**Auth is two-tier** (both in `express-session`):
- `req.session.authenticated` — required for all main routes and static media
- `req.session.adminAuthenticated` — additionally required for `/admin` and admin API routes

**Data flow for a display update:**
1. Frontend POSTs `stateFront` to `/nork-update-display-data-route`
2. `updateDisplayDataController` → `runUpdateDisplayData(stateFront)` in `main-back.js`
3. Dispatches to `getNewArticles` / `getNewPics` / `getNewVids` based on `typeTrigger`
4. Each builds query params and calls `dataLookup()` → `dbModel` → MongoDB (sort order set in query)
5. Result array returned as JSON

**MongoDB collections:** `articles`, `pics`, `picSets`, `vidPages`. Names come from `COLLECTIONSARR`.

### Frontend (Vanilla JS ES modules, no bundler)

```
public/js/
  main.js             buildDisplay() (first load) + updateDisplay() — main refresh
  responsive.js       ALL event listeners (click, change, input, keydown) — event hub
  run.js              State-change handlers called by responsive.js
  auth.js             Auth page logic
  admin.js            Admin page entry (buildAdminDisplay, updateAdminDisplay)
  util/
    state-front.js    stateFront singleton — all view state
    api-front.js      sendToBack(inputParams) — POST wrapper
    params.js         getAuthParams, getAdminAuthParams, getAdminCommandParams
    collapse-display.js  buildCollapseContainer, defineCollapseItems, hideArray, unhideArray
    define-things.js  SVG constants (EYE_OPEN, EYE_CLOSED, COLLAPSE_ARROW), articleURLs
    debounce.js       500ms debounce for how-many input
  control/
    drop-down-form.js   Hamburger dropdown builder
    input-forms.js      Accordion of articles/pics/vids forms
    return-form.js      buildReturnDisplay() — routes to type-specific renderer
    auth-form.js        Auth and admin-auth form builders
  articles/           buildArticlesForm, buildArticlesReturnDisplay + DOM helpers
  pics/               buildPicsForm, buildPicsReturnDisplay, buildPicsCollapseContainer
  vids/               buildVidsForm, buildVidsReturnDisplay + DOM helpers
  admin/
    admin-form.js       Admin command form (command, target, how-much, URL input)
    admin-return.js     Stats bar + sortable log table
    admin-run.js        runAdminAuth, runAdminCommand (polls status, refreshes display)
    admin-responsive.js Event listeners for admin page
    admin-sort-tbl.js   setAdminTableData, runAdminSortColumn
    admin-status.js     buildAdminStatusDisplay (scrape/scheduler live status)
```

**`stateFront` singleton** (`util/state-front.js`). Key fields:
- `isFirstLoad: boolean` — true until first `buildDisplay()` completes
- `typeTrigger`: `"articles"` | `"pics"` | `"vids"`
- `articleType`: `"fatboy"` | `"topNews"` | `"latestNews"` | `"externalNews"` | `"anecdote"` | `"people"` | `"all"`
- `picType`: `"all"` | `"picSets"`
- `vidType`: `"vidPages"`
- `orderBy`: `"newest-to-oldest"` | `"oldest-to-newest"`
- `howMany`: number | null (falls back to `DEFAULT_LOAD_*` env var)
- `eventTrigger`: last user action that triggered an update
- `scrapeId`: tracks active scrape for admin
- `dataObj`: nested count tracker `{ articles: { fatboy, topNews, ... }, pics, vids }`

**Admin commands** (sent via `runAdminCommand`):
- `command`: `start-scrape` | `stop-scrape` | `start-scheduler` | `stop-scheduler` | `scrape-status`
- `site` (target): `kcna` | `watch`
- `howMuch`: `scrape-new` | `scrape-all` | `scrape-url`

Static media (`EXPRESS_PIC_PATH`, `EXPRESS_VID_PATH`, `EXPRESS_WATCH_PATH`) is auth-gated — served only to authenticated sessions.

## Tests

```
tests/
  backend/      admin-back.test.js, articles.test.js, main-back.test.js, pics.test.js, vids.test.js
  controllers/  auth-controller.test.js, data-controller.test.js, display-controller.test.js
  frontend/     articles-return.test.js, collapse-display.test.js, debounce.test.js,
                pics-return.test.js, state-front.test.js, vids-return.test.js
  middleware/   session-config.test.js
  routes/       auth.test.js
```

Run with `npm test` (vitest).
