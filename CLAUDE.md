# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Important: You are the orchestrator. subagents execute. you should NOT build, verify, or code inline (if possible). your job is to plan, prioritize & coordinate the acitons of your subagents

Keep your replies extremely concise and focus on providing necessary information.

Put all pictures / screenshots you take with the mcp plugin in the "pics" subfolder, under the .claude folder in THIS project.

Do NOT commit anything to GitHub. The user will control all commits to GitHub. Do NOT edit or in any way change the user's Git history or interact with GitHub.

## Commands

```bash
npm start        # Start with nodemon (auto-restarts on changes)
```

No test suite is configured. There is no lint script in `package.json`.

## Config Setup

All configuration is loaded from a `.env` file in the project root (gitignored). The app will not start without it.

Key `.env` variables:
- `DISPLAY_PORT`, `SCRAPE_PORT` — service ports
- `PW`, `ADMIN_PW` — auth passwords
- `SESSION_SECRET` — express-session secret
- `MONGO_URI`, `DB_NAME` — MongoDB connection
- `COLLECTIONSARR` — comma-separated collection names
- `PIC_PATH`, `VID_PATH`, `WATCH_PATH` — filesystem media paths
- `EXPRESS_PIC_PATH`, `EXPRESS_VID_PATH`, `EXPRESS_WATCH_PATH` — URL prefixes for static media
- `DEFAULT_LOAD_ARTICLES`, `DEFAULT_LOAD_PICS`, etc. — default result counts
- `UPDATE_DISPLAY_DATA_ROUTE`, `ADMIN_*_ROUTE` — API route names

Config is loaded in `middleware/config.js` (exports `CONFIG`) and `middleware/db-config.js` (exports `dbConnect`, `dbGet`).

## Architecture

This is a **two-service system**. This repo (the displayer) runs on `displayPort` and communicates with a separate scraper service running on `scrapePort` via HTTP (axios). Admin commands are proxied to the scraper via `src/admin-back.js → runAdminCommand()`.

### Backend (Node.js/Express, ESM modules)

```
app.js                  Entry point: middleware, static paths, session, routes
routes/router.js        All route definitions
routes/auth.js          Session-based auth middleware (requireAuth, requireAdminAuth)
controllers/
  auth-controller.js    Password check → set session flags
  display-controller.js Serve static HTML files
  data-controller.js    Bridge between HTTP routes and backend logic
src/
  main-back.js          dataLookup() and sortDataReturn() — core DB query logic
  admin-back.js         Proxy commands to scraper; fetch all collection data
  kcna/
    articles.js         Build query params for articles collection
    pics.js             Build query params for pics / picSets collections
    vids.js             Build query params for vidPages collection
models/db-model.js      dbModel class wrapping MongoDB queries (getNewest, getOldest, etc.)
```

**Auth is two-tier**, both stored in `express-session`:
- `req.session.authenticated` — required for all main routes
- `req.session.adminAuthenticated` — additionally required for `/admin` and admin API routes

**Data flow for a display update:**
1. Frontend POSTs `stateFront` to `updateDisplayDataRoute`
2. `updateDisplayDataController` → `runUpdateDisplayData(stateFront)` in `main-back.js`
3. Dispatches to `getNewArticles` / `getNewPics` / `getNewVids` based on `typeTrigger`
4. Each builds query params and calls `dataLookup()` → `dbModel` → MongoDB
5. Results sorted by `sortDataReturn()` (newest first) and returned as JSON

**MongoDB collections:** `articles`, `pics`, `picSets`, `vidPages` (and potentially `vids`). Collection names come from `CONFIG.collectionsArr`.

### Frontend (Vanilla JS ES modules, no bundler)

```
public/js/
  run.js              Auth actions, dropdown/button toggle handlers
  main.js             updateDisplay() — the main refresh function
  auth.js             Auth page logic
  admin.js            Admin page logic
  responsive.js       Responsive layout handling
  util/
    state-front.js    stateFront singleton — tracks current view state
    api-front.js      sendToBack() — fetch wrapper for all API calls
    params.js         Build request payloads from stateFront
    collapse-display.js  Hide/show helpers
    define-things.js  SVG constants etc.
  articles/           Build and render article DOM
  pics/               Build and render pic DOM
  vids/               Build and render vid DOM
  control/            Form/input handling modules
  admin/              Admin-specific UI modules
```

**Frontend state** lives in `stateFront` (`util/state-front.js`). Key fields:
- `typeTrigger`: `"articles"` | `"pics"` | `"vids"` — which data type is shown
- `articleType`: `"fatboy"` | `"topNews"` | `"latestNews"` | `"externalNews"` | `"anecdote"` | `"people"` | `"all"`
- `picType`: `"all"` | `"picSets"`
- `vidType`: `"vidPages"`
- `orderBy`: `"newest-to-oldest"` | `"oldest-to-newest"`
- `howMany`: count or null (falls back to `CONFIG.defaultDataLoad`)

Static media (pics, vids) is served from filesystem paths defined in `CONFIG` and exposed under custom URL prefixes via `expressPicPath`, `expressVidPath`, `expressWatchPath`.
