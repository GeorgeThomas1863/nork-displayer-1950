import express from "express";

import { indexDisplay, adminDisplay, display404, display500 } from "../controllers/display.js";
import { adminSubmitRoute, getBackendDataRoute } from "../controllers/api.js";

const router = express.Router();

router.post("/admin-submit-route", adminSubmitRoute);

router.post("/get-backend-data", getBackendDataRoute);

// router.post("/scrape-submit-route", parseCommand);

router.get("/", indexDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;
