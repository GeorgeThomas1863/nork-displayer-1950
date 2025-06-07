//ADD CLAUDE's ANSWER FOR PIC / VID EXIST MONGO PROBLEM

//IMPLEMET DATE SORTS

//ADD MEDIA STYLES

//FIX PIC ALONE ORDER (SORT BY DATE RATHER THAN ID)

//FIX PIC SET / VID PAGE DISPLAY

//PIC ALONE DISPLAY IS WRONG ORDER

//FUTURE BUG LIST:
// - make article display better (3 across with pics, if present)
// - combine vid / vid page display into one (just use vid page)
// - border radius on pics is still weird, check collapse container border radius

//UNFUCK PIC DISPLAY WITH VERTICAL PICS

//[PROB DONT WANT TO DO BELOW]
//MAKE GET NEW DATA A SINGLE FUNCTION PASSING IN THE TYPE TO BACKEND
//THIS WAY YOU CAN DO THE SAME SEQUENCE AS YOU DO FOR DEFAULT DATA (AND FIX PICS BEFORE RETURNING)

//PUT PIC / VID STATS IN HOVER

// MAKE VID ALONE DISPLAY NICER (put in wrappers, margins, etc)

//MAKE BACKEND DISPLAY STYLING BETTER (return container connected to forms)

//make drop down responsive (2 action buttons)

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
