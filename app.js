//TODO: ADD AUTHENTICATION TO REG VIEW AND ADMIN VIEW, CREATE BLANK LANDING PAGE, COPY ANGEL AI

//POLLING WORKING

import CONFIG from "./config/config.js";
import express from "express";
import cors from "cors";
import routes from "./routes/router.js";

const { expressPicPath, expressVidPath, expressWatchPath, expressConfigPublicPath, picPath, vidPath, watchPath, scrapePort, displayPort } = CONFIG;

const app = express();

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
