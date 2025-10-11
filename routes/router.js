import express from "express";

import CONFIG from "../config/config.js";
import { mainDisplay, adminDisplay, display404, display500 } from "../controllers/display-controller.js";
import { getBackendValueController, apiEndpointController, sendAdminCommandController, pollingController } from "../controllers/api-controller.js";

const router = express.Router();

//api receive endpoint
router.post(CONFIG.apiDisplayer, apiEndpointController);

//poll backend
router.post("/polling-route", pollingController);

//send data to scraper
router.post("/send-admin-command-route", sendAdminCommandController);

router.post("/get-backend-value-route", getBackendValueController);
// router.post("/get-backend-value-route", requireAuth, getBackendValueController);

router.get("/", mainDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;

// router.post("/admin-data-route", adminDataRouteController);

//admin routes
// router.post("/get-default-data-admin-route", getDefaultDataAdminRoute);
// router.get("/get-update-data-admin-route", getUpdateDataAdminRoute);

// router.post("/get-backend-data-route", getBackendDataRoute);
