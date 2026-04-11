//FIGURE OUT HOWTO PULL PICS FROM TELEGRAM AND DISPLAY ON FRONTEND, CANNOT STORE PICS ON SERVER, TOO FUCKING MANY
//change duration to hours / minutes on admin display


import express from "express";
import session from "express-session";
import routes from "./routes/router.js";

import { buildSessionConfig } from "./middleware/session-config.js";
import { dbConnect } from "./middleware/db-config.js";
import { requireAuth } from "./routes/auth.js";

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
