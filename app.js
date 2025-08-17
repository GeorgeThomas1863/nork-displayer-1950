//****************

// GET vid-player-hls.js WORKING. Note .get thing happening, way data is passed doesnt make sense;
// prob WRONGLY trying to get from backend (rather than using fucking manifestPath as instructed a billion times)

//GO BACK TO SOME LIBRARY ANSWER FOR VID DISPLAY (SAVE OLD VERISONS OF WHAT YOU HAVE BUT THIS IS NOT WORTH IT)

//ADD VID CSS FIRST, THEN SEE IF IT WORKS
//UNFUCK WITH CLAUDE

//------

//Fixed pic array display (had update db off in scraper)

//CREATE A TIMER ON FRONTEND TO REFRESH DATA IF SOMETHING IS ACTIVE (use the state)

//NOT DISPLAYING PICS AND VIDS STATS ON ADMIN PAGE

//PUT THE NEW SCRAPE DATA UNDER FORM (make form tighter), put new stats next to current stats (or in SAME collapse container)

//FUCKING FIX THE GODDAMN SCHEDULER / TEST IT A BUNCH

//FIX SCRAPE STATUS

//******************* */

//BUILD A DISPLAY FOR DATA UPDATES, then DEBUG WHAT API IS RETURNING

//NOW THAT DATA IS DISPLAYING, FIGURE OUT IF API IS RETURNING RIGHT SHIT AND HOW TO RESTART THSI SHIT

//FIX TOO MANY INPUTS, TEST various injections

//UNFUCK PROBLEM WITH SCRAPE CLEAN FUNCTION

//ADD VID STATS

//ADD IN CLEAN UP FS BASED ON ITEMS ON DISK

//MAYBE ADD A BOTTOM BAR ON MEDIA STYLES TO SEPARATE FORMS FROM DATA RETURN

//CONFIRM SCHEDULER WORKS

// continue building admin start / stop capabilities

// 1. admin functionality
// 1. admin auth

// 1. chronjob or some other way to auto delete pics / vids from server
// 1. tracing

//STUFF TO DO AT THE END:
// - write chronjob that deletes files after certain number on server
// - as part of chronjob, look for pics / vids under certain size and delete them (bc errors)
// - set the cors thing to just this port
//- make scroll an event, load more pics / vids on scroll (esp on mobile)s

//****************

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
// import session from "express-session";

import CONFIG from "./config/config.js";
import routes from "./routes/routes.js";
// import * as db from "./data/db.js";

const { picPath, vidPath, watchPath, expressPicPath, expressVidPath, expressWatchPath, displayPort, expressConfigPublicPath } = CONFIG;

const app = express();

//custom paths to expose to frontend
app.use(expressPicPath, express.static(picPath));
app.use(expressVidPath, express.static(vidPath));
app.use(expressWatchPath, express.static(watchPath));
app.use(expressConfigPublicPath, express.static("config/config-public.js"));
app.use("hls.js", express.static("node_modules/hls.js/dist/hls.min.js"));

//standard public path
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic usage - allows all origins
app.use(cors());

// CONFIGURE BELOW LATER
app.use(
  cors({
    origin: ["http://localhost:1951", "http://localhost:1952"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//routes
app.use(routes);

// app.listen(1801);
app.listen(displayPort);
