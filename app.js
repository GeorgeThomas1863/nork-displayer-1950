//throwing otu a bunch of shit, very ugly performance

//TEST / STYLE PIC STATS DISPLAY

//BUILD PIC SET / VID PAGE DISPLAYS

// STYLE ARTICLE LIST BETTER (3 across with pics, if present)

//PUT PIC / VID STATS IN HOVER

// MAKE VID ALONE DISPLAY NICER (put in wrappers, margins, etc)

//MAKE BACKEND DISPLAY STYLING BETTER (return container connected to forms)

//ADD MEDIA QUERIES

//REBUILD ADMIN DATA TRACKING

//MAKE ADMIN PAGE LOOK NICE

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
