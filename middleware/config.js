import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { buildSessionConfig } from "./session-config.js";

const CONFIG = {
  // Server
  displayPort: process.env.DISPLAY_PORT,
  scrapePort: process.env.SCRAPE_PORT,

  // Auth
  pw: process.env.PW,
  pwAdmin: process.env.ADMIN_PW,

  // API
  apiDisplayer: process.env.API_DISPLAYER,
  apiScraper: process.env.API_SCRAPER,

  // Routes
  updateDisplayDataRoute: process.env.UPDATE_DISPLAY_DATA_ROUTE,
  adminAuthRoute: process.env.ADMIN_AUTH_ROUTE,
  adminCommandRoute: process.env.ADMIN_COMMAND_ROUTE,
  adminDataRoute: process.env.ADMIN_DATA_ROUTE,
  adminPollingRoute: process.env.ADMIN_POLLING_ROUTE,

  // File system paths
  mediaPath: process.env.MEDIA_PATH,
  picPath: process.env.PIC_PATH,
  vidPath: process.env.VID_PATH,
  tmpPath: process.env.TMP_PATH,
  watchPath: process.env.WATCH_PATH,

  // Express static URL paths
  expressPicPath: process.env.EXPRESS_PIC_PATH,
  expressVidPath: process.env.EXPRESS_VID_PATH,
  expressWatchPath: process.env.EXPRESS_WATCH_PATH,

  // DB
  collectionsArr: process.env.COLLECTIONSARR.split(","),

  // Default data load counts
  defaultDataLoad: {
    articles: +process.env.DEFAULT_LOAD_ARTICLES,
    picSets: +process.env.DEFAULT_LOAD_PICSETS,
    pics: +process.env.DEFAULT_LOAD_PICS,
    vidPages: +process.env.DEFAULT_LOAD_VIDPAGES,
    vids: +process.env.DEFAULT_LOAD_VIDS,
  },

  // Session builder
  buildSessionConfig,
};

export default CONFIG;
