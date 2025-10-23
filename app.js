//TODO: KEEP GOING WITH REFACTORING BACKEND

//BUILD JS FOR ADMIN DATA RETURN

//UNFUCK SCRAPER UPDATING

//FIGURE OUT HOW TO ACTUALLY PASS DATA SECURELY

import express from "express";
import session from "express-session";
import cors from "cors";
import routes from "./routes/router.js";

import CONFIG from "./config/config.js";

const { expressPicPath, expressVidPath, expressWatchPath, expressConfigPublicPath, picPath, vidPath, watchPath, scrapePort, displayPort } = CONFIG;

const app = express();

//claude solution to auth problem
app.set("trust proxy", 1);

app.use(session(CONFIG.buildSessionConfig()));

//custom paths to expose to frontend
app.use(expressPicPath, express.static(picPath));
app.use(expressVidPath, express.static(vidPath));
app.use(expressWatchPath, express.static(watchPath));
app.use(expressConfigPublicPath, express.static("config/config-public.js"));

//standard public path
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [`http://localhost:${scrapePort}`],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//routes
app.use(routes);

// app.listen(1801);
app.listen(displayPort);
