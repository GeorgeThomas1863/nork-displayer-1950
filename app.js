import express from "express";
// import cors from "cors";
// import session from "express-session";

import CONFIG from "./config/config.js";
import routes from "./routes/router.js";

const app = express();

//custom paths to expose to frontend
app.use(CONFIG.expressPicPath, express.static(CONFIG.picPath));
app.use(CONFIG.expressVidPath, express.static(CONFIG.vidPath));
app.use(CONFIG.expressWatchPath, express.static(CONFIG.watchPath));
app.use(CONFIG.expressConfigPublicPath, express.static("config/config-public.js"));

//standard public path
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic usage - allows all origins
// app.use(cors());

// // // CONFIGURE BELOW LATER
// app.use(
//     cors({
//         origin: ["http://localhost:1951", "http://localhost:1950"],
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );

//routes
app.use(routes);

// app.listen(1801);
app.listen(CONFIG.displayPort);
