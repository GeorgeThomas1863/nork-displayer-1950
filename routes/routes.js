import express from "express";

import { indexDisplay, adminDisplay, display404, display500 } from "../controllers/display.js";
import { getAdminBackendDataRoute, getBackendDataRoute } from "../controllers/data-controller.js";

const router = express.Router();

router.post("/get-admin-backend-data-route", getAdminBackendDataRoute);

router.post("/get-backend-data-route", getBackendDataRoute);

router.get("/", indexDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;
