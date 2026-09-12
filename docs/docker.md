# Docker

The production stack is one Docker Compose project named `nork`: `displayer`, `scraper`, and `mongo`. The displayer is published only on `127.0.0.1:<DISPLAY_PORT>`; host nginx remains the public entry point.

## Prerequisites

Before running Compose, confirm all of the following:

- The `nork-displayer-1950` and `nork-scraper-1950` repositories are side by side. From the displayer repository, the scraper must be available at `../nork-scraper-1950`.
- Each repository has its own `.env` file with its production settings. Neither repository uses a `config/` directory; all configuration comes from `.env`.
- Docker Engine and the Docker Compose plugin are installed.
- The host has enough free disk space for Docker images, MongoDB, the pic volume, and backups.

Run all commands below from the displayer repository unless a step says otherwise. Do not display or copy either `.env` file into logs.

## Routine operations

Build images and start the stack:

```sh
docker compose -p nork up -d --build
```

The package shortcut is equivalent:

```sh
npm run docker:up
```

Tail all service logs, or select one service:

```sh
docker compose -p nork logs -f
docker compose -p nork logs -f displayer
docker compose -p nork logs -f scraper
docker compose -p nork logs -f mongo
```

The package shortcut tails the configured logs:

```sh
npm run docker:logs
```

Stop and remove containers while preserving data:

```sh
docker compose -p nork down
```

The package shortcut is equivalent:

```sh
npm run docker:down
```

> **NEVER run `docker compose down -v`.** The `-v` flag deletes `nork_mongo-data` and `nork_pics`. MongoDB data and all copied pics are then recoverable only from a valid backup.

## nginx

Keep nginx on the host. It should proxy the public site to `127.0.0.1:<DISPLAY_PORT>`, where `<DISPLAY_PORT>` is the displayer port configured for production. Only the displayer publishes a host port; `scraper` and `mongo` communicate on the private Compose network.

If nginx already uses that same loopback address and port, only reload it after validating the new stack. Do not expose MongoDB or the scraper publicly.

## Persistent volumes

| Volume | Mounted location | Contents |
| --- | --- | --- |
| `nork_mongo-data` | MongoDB data directory in `mongo` | `log`, `articles`, `pics`, `picSets`, and `vidPages` collections |
| `nork_pics` | `/data/pics` in both app containers | Scraped picture files; read-only in `displayer` |

Confirm the names before backup or migration:

```sh
docker volume inspect nork_mongo-data
docker volume inspect nork_pics
```

## Backups

Create the destination directory first:

```sh
mkdir -p backups
```

Dump the configured database from the running MongoDB container. Replace `<DB_NAME>` with the exact database name:

```sh
docker compose -p nork exec -T mongo mongodump --archive --db "<DB_NAME>" > "backups/nork-mongo-$(date +%F).archive"
```

Archive the pic volume through a throwaway Alpine container:

```sh
docker run --rm -v nork_pics:/data:ro -v "${PWD}/backups:/out" alpine sh -c 'tar czf /out/nork-pics.tgz -C /data .'
```

Check that both backup files are non-empty and store a copy away from the production host. Test restores periodically; an untested archive is not a reliable backup.

## Production migration

The following is a one-time cutover from the host Node processes and host `mongod`. It streams MongoDB data without writing an intermediate database dump.

### 1. Prepare and stage the stack

Back up the current host database and pic directory first. Build the images, then start only the container MongoDB so the app stack cannot scrape before the final transfer:

```sh
docker compose -p nork build
docker compose -p nork up -d mongo
docker compose -p nork ps
docker volume inspect nork_mongo-data
docker volume inspect nork_pics
```

At this stage, leave nginx pointed at the host displayer. Compose creates the empty named volumes, but `displayer` and `scraper` remain stopped. Do not allow the container scraper and host scraper to write concurrently.

### 2. Begin the final transfer window

Stop the host scraper first so no new database records or pic files arrive during the final copy. Keep the host displayer and host `mongod` running temporarily so the old site remains readable.

Use the production process manager to stop the host scraper. The exact command is deployment-specific; verify that the process is stopped before continuing.

### 3. Migrate MongoDB

Replace `<HOST_MONGO_URI>` and `<DB_NAME>` explicitly. Confirm that the restore target is the Compose `mongo` service before running this command: `--drop` replaces matching collections in the target database.

```sh
mongodump --uri="<HOST_MONGO_URI>" --archive --db "<DB_NAME>" | docker compose -p nork exec -T mongo mongorestore --archive --drop --nsInclude "<DB_NAME>.*"
```

Compare the five collection counts on the host:

```sh
mongosh "<HOST_MONGO_URI>" --quiet --eval 'const d=db.getSiblingDB("<DB_NAME>"); for (const c of ["log","articles","pics","picSets","vidPages"]) print(c+"="+d.getCollection(c).countDocuments())'
```

Then compare the same counts in the container:

```sh
docker compose -p nork exec -T mongo mongosh --quiet --eval 'const d=db.getSiblingDB("<DB_NAME>"); for (const c of ["log","articles","pics","picSets","vidPages"]) print(c+"="+d.getCollection(c).countDocuments())'
```

Do not continue until every source and destination count matches.

### 4. Migrate pics

Replace `<HOST_PIC_PATH>` with the absolute host directory. This preserves the contents of the source directory inside the named volume:

```sh
docker run --rm -v "<HOST_PIC_PATH>:/src:ro" -v nork_pics:/dst alpine sh -c 'cp -a /src/. /dst/'
```

For a very large directory, this can take a long time. `rsync` is a better alternative when progress reporting and restartable copies are important; mount the same source and destination and run an image that contains `rsync`.

The copy requires space for both the old host directory and the Docker volume. If the host cannot temporarily hold both, stop and change the Compose pic storage to a bind mount of the existing host directory instead of copying it. Do not start a copy that can exhaust the production disk.

Verify representative files and compare source/destination file counts before cutover. Also verify that the scraper can write to `/data/pics` and the displayer can read it.

Pic documents do not need a `savePath` rewrite. The displayer reads `savePath`, takes only its basename, and builds `/kcna-pics/<filename>`; the old host prefix is never used to locate the file. Therefore `scripts/rewrite-savepath.js` is intentionally not required.

### 5. Cut over

Perform the remaining steps in this order:

1. Start or restart the complete Compose stack and confirm all services are healthy.
2. Run the smoke checklist below against the loopback displayer.
3. Switch nginx to `127.0.0.1:<DISPLAY_PORT>` and reload nginx.
4. Confirm the public site, admin status request, and a pic again through nginx.
5. Stop the old host displayer.
6. Monitor the container logs and verify new scraper data and pics arrive.
7. Stop and disable the host `mongod` last, only after the Docker database is proven current.

### Rollback

If validation fails before new container writes are accepted, point nginx back to the host displayer, stop the Compose scraper, restart the host scraper and displayer, and leave host `mongod` running.

If the container scraper has already written new records or pics, stop it first and preserve backups of both Docker volumes before rollback. Reconcile those new records and files deliberately; switching blindly to the old database can lose data. Do not remove the Docker volumes during rollback.

## Pic trimming

The scraper writes new pics continuously, so storage control is a recurring operation rather than a one-time cleanup.

Available policies are:

- Age retention: `--older-than <days>` selects files whose modification time is older than the cutoff.
- Orphan removal: `--orphans` selects filenames not referenced by any document in the `pics` collection.
- Size cap: monitor `nork_pics` and define a maximum operational size. The current script reports candidates and total megabytes but does not enforce a cap automatically; free space by applying the orphan and age policies deliberately.

Start conservatively: run an orphan-only dry run, inspect its log, then add an age threshold appropriate for the site. Combining the options selects files that meet either enabled policy.

Dry-run examples inside the displayer container:

```sh
docker compose -p nork exec -T displayer node scripts/trim-pics.js --orphans
docker compose -p nork exec -T displayer node scripts/trim-pics.js --older-than 365
docker compose -p nork exec -T displayer node scripts/trim-pics.js --orphans --older-than 365
```

The script prints the candidate count and total megabytes and writes the candidate list to `.claude/.tmp/trim-pics-<timestamp>.log`. Dry-run is the default; files are removed only with `--delete`.

> **Back up `nork_pics` and verify the archive before every `--delete` run.** Review the generated candidate log before deleting anything.

The Compose displayer mount is read-only by design. Dry runs work there, but `--delete` cannot. For deletion, use a controlled maintenance run in an environment where this same image has `nork_pics` mounted read-write; keep the scraper stopped for the operation, and restore its normal read-only displayer mount afterward. Never weaken the long-running displayer mount merely for convenience.

A recurring cron dry run provides an audit without deleting files. Replace `<COMPOSE_DIR>` with the absolute displayer repository path:

```cron
15 3 * * 0 cd <COMPOSE_DIR> && docker compose -p nork exec -T displayer node scripts/trim-pics.js --orphans --older-than 365 >> .claude/.tmp/trim-pics-cron.log 2>&1
```

Review cron output and candidate logs regularly. Schedule any deletion only after a fresh volume backup and with the scraper stopped so files are not changing during selection.

## Smoke checklist

Run this checklist before switching nginx and repeat it through the public nginx endpoint afterward:

- Confirm all three services are running with `docker compose -p nork ps`.
- Confirm the displayer login page responds successfully: `curl --fail --show-error --head "http://127.0.0.1:<DISPLAY_PORT>/"`.
- Sign in to `/admin`, issue `scrape-status`, and confirm a valid scraper status is returned. This round trip proves browser to displayer to scraper communication.
- While authenticated, request one known pic URL and confirm HTTP 200: `curl --fail --show-error --output /dev/null --write-out '%{http_code}\n' --cookie "<AUTH_COOKIE_FILE>" "http://127.0.0.1:<DISPLAY_PORT>/kcna-pics/<FILENAME>"`.
- Check `docker compose -p nork logs --since 10m displayer scraper mongo` for errors.

The pic route is authentication-gated. `<AUTH_COOKIE_FILE>` must be a valid curl cookie jar created through the normal login flow; do not put production passwords directly in shell history.
