//FIGURE OUT HOWTO PULL PICS FROM TELEGRAM AND DISPLAY ON FRONTEND, CANNOT STORE PICS ON SERVER, TOO FUCKING MANY
//change duration to hours / minutes on admin display
//keep going

//FIGURE OUT HOW TO ACTUALLY SECURE MONGO

import express from "express";
import session from "express-session";
import routes from "./routes/router.js";

import { buildSessionConfig } from "./middleware/session-config.js";
import { dbConnect } from "./middleware/db-config.js";
import { requireAuth } from "./routes/auth.js";
import { runAdminCommand } from "./src/admin-back.js";
import { dbGet } from "./middleware/db-config.js";

const app = express();

//claude solution to auth problem
// app.set("trust proxy", 1);

app.use(session(buildSessionConfig()));

//custom paths to expose to frontend
app.use(process.env.EXPRESS_PIC_PATH, requireAuth, express.static(process.env.PIC_PATH));
app.use(process.env.EXPRESS_VID_PATH, requireAuth, express.static(process.env.VID_PATH));
app.use(process.env.EXPRESS_WATCH_PATH, requireAuth, express.static(process.env.WATCH_PATH));

//standard public path
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use(routes);

// app.listen(1801);
await dbConnect();
app.listen(process.env.DISPLAY_PORT);

// autoStartScheduler().catch(e => console.error("[startup] Fatal:", e));

// async function autoStartScheduler() {
//   const config = await dbGet().collection("appConfig").findOne({ _id: "config" });
//   if (!config?.schedulerActive) return;

//   const INITIAL_DELAY = 3000;
//   const RETRY_DELAY = 5000;
//   const MAX_RETRIES = 5;

//   await new Promise((r) => setTimeout(r, INITIAL_DELAY));

//   for (let i = 0; i < MAX_RETRIES; i++) {
//     const result = await runAdminCommand({ command: "admin-start-scheduler" });
//     if (result) {
//       console.log("[startup] Scheduler auto-started");
//       return;
//     }
//     console.log(`[startup] Scheduler start attempt ${i + 1}/${MAX_RETRIES} failed, retrying...`);
//     if (i < MAX_RETRIES - 1) await new Promise((r) => setTimeout(r, RETRY_DELAY));
//   }

//   console.error("[startup] Could not auto-start scheduler after retries");
// }
