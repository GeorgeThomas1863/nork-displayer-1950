//****************

//FIX ADMIN DISPLAY

//PERHAPS REVERT DISPLAY? AND MAKE TIMER THING

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

const { picPath, vidPath, expressPicPath, expressVidPath, displayPort } = CONFIG;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static("public"));

// app.set("views", join(__dirname, "html"));
// app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic usage - allows all origins
app.use(cors());

// CONFIGURE BELOW LATER
// app.use(cors({
//   origin: 'http://localhost:1951', // Allow only the display app
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.static("public"));

//path to pics / vids on fs
app.use(expressPicPath, express.static(picPath));
app.use(expressVidPath, express.static(vidPath));

//routes
app.use(routes);

// app.listen(1801);
app.listen(displayPort);
