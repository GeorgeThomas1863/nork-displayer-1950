//FIGURE OUT HOWTO PULL PICS FROM TELEGRAM AND DISPLAY ON FRONTEND, CANNOT STORE PICS ON SERVER, TOO FUCKING MANY
//change duration to hours / minutes on admin display


import express from "express";
import session from "express-session";
import routes from "./routes/router.js";

import { buildSessionConfig } from "./middleware/session-config.js";
import { dbConnect } from "./middleware/db-config.js";
import { mountAuthStatic, mountRequiredAuthStatic, resolveListenHost } from "./middleware/static-media.js";

const app = express();

//claude solution to auth problem
app.set("trust proxy", 1);

app.use(session(buildSessionConfig()));

//custom paths to expose to frontend
mountRequiredAuthStatic(app, process.env.EXPRESS_PIC_PATH, process.env.PIC_PATH, "pics");
mountAuthStatic(app, process.env.EXPRESS_VID_PATH, process.env.VID_PATH);
mountAuthStatic(app, process.env.EXPRESS_WATCH_PATH, process.env.WATCH_PATH);

//standard public path
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use(routes);

// app.listen(1801);
await dbConnect();

//loopback by default; containers override HOST to expose the service
app.listen(process.env.DISPLAY_PORT, resolveListenHost(process.env.HOST), () =>
  console.log(`Displayer running on port ${process.env.DISPLAY_PORT}`)
);

