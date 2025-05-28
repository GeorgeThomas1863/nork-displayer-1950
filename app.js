//(other buttons dont have children you moron)

//IMPLEMENT CLICK LOGIC ON FORMS

//otherwise just use the closest shit and implement that

//BUILD RESPONSIVE; FIGURE OUT DATA ACTION

//RECREATE ADMIN SUBMIT CAPABILITY (so can use scraper)

//BUILD IN SEPARATE CONTAINERS FOR THINGS AT THE TOP AND APPEND IN DATA AT BOTTOM

//NOT POSSIBLE T OJUST USE ONE CONTAINER AS YOURE TRYING TO DO

//BUILD OTHER FORMS

//MAKE RESPONSIVE

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
