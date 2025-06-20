import express from "express";

import { indexDisplay, adminDisplay, display404, display500 } from "../controllers/display.js";
import { adminSubmitRoute, getAdminBackendDataRoute, getBackendDataRoute } from "../controllers/data-controller.js";

const router = express.Router();

router.post("/admin-submit-route", adminSubmitRoute);

router.post("/get-admin-backend-data-route", getAdminBackendDataRoute);

router.post("/get-backend-data-route", getBackendDataRoute);

// router.post("/get-new-data-route", getNewDataRoute);

router.get("/", indexDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;
