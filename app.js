//TO DO:

//****************

//DO FIRST: FINISH REPULLING VIDS, repullData in src-fix.js

//**************

//GET VID PAGE DISPLAY WORKING

//UNFUCK PROBLEM WITH SCRAPE CLEAN FUNCTION

//UNFUCK THE CSS / NAMES IN CSS

//NEWEST TO OLDEST IS FUCKED ON THE BACKEND, GETTING THE WRONG DATA

//LOGIC PROBLEM IN APPENDING NEW DATA

//[VID CHECK FIXED]

//MAKE NEW DATA WORK, USE STATE TO TRIGGER GETTING / LOADING NEW DATA

//ADD LOGIC for WHETHER getting new data is necessary [key part]

//KEEP GOING WIHT LOGIC FOR WHETHER TO GET NEW DATA

//REDO EVENT LISTENERS FOR HOW MUCH

// get rid of vids as separate thing

//CONFIRM SCHEDULER WORKS

//ADD AUTO SCRAPER / make it part of admin start / stop

// continue building admin start / stop capabilities

// 1. admin functionality
// 1. admin auth

// 1. chronjob or some other way to auto delete pics / vids from server
// 1. tracing

//FUTURE BUG LIST:
// - make article display better (3 across with pics, if present)
// - "external articles" link seems to be constantly broken, check if right link
// - border radius on pics is still weird, check collapse container border radius

//STUFF TO DO AT THE END:
// - write chronjob that deletes files after certain number on server
// - as part of chronjob, look for pics / vids under certain size and delete them (bc errors)
// - set the cors thing to just this port

//THINGS TO DO LATER:
// - UNFUCK PIC DISPLAY WITH VERTICAL PICS
// - add vid stats to vid display
// - make scroll an event, load more pics / vids on scroll (esp on mobile)

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
