//FIGURE OUT HOWTO PULL PICS FROM TELEGRAM AND DISPLAY ON FRONTEND, CANNOT STORE PICS ON SERVER, TOO FUCKING MANY
//change duration to hours / minutes on admin display
//keep going

//FIGURE OUT HOW TO ACTUALLY SECURE MONGO

import express from "express";
import session from "express-session";
import routes from "./routes/router.js";

import CONFIG from "./middleware/config.js";
import { dbConnect } from "./middleware/db-config.js";
import { requireAuth } from "./routes/auth.js";

const { expressPicPath, expressVidPath, expressWatchPath, picPath, vidPath, watchPath, displayPort } = CONFIG;

const app = express();

//claude solution to auth problem
// app.set("trust proxy", 1);

app.use(session(CONFIG.buildSessionConfig()));

//custom paths to expose to frontend
app.use(expressPicPath, requireAuth, express.static(picPath));
app.use(expressVidPath, requireAuth, express.static(vidPath));
app.use(expressWatchPath, requireAuth, express.static(watchPath));

//standard public path
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use(routes);

// app.listen(1801);
await dbConnect();
app.listen(displayPort);
