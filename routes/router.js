import express from "express";

import CONFIG from "../config/config.js";
import { requireAuth, requireAdminAuth } from "./auth.js";
import { authController, adminAuthController, adminCurrentDataController } from "../controllers/auth-controller.js";
import { mainDisplay, adminDisplay, display404, display500, display401 } from "../controllers/display-controller.js";
import { getBackendValueController, updateDataController, apiEndpointController, adminCommandController, pollingController } from "../controllers/api-controller.js";

const { adminAuthRoute, adminCommandRoute, apiDisplayer, adminCurrentDataRoute } = CONFIG;

const router = express.Router();

//CLEAN UP BELOW

// Login AUTH route
router.post("/site-auth-route", authController);
router.post(adminAuthRoute, adminAuthController);
router.get("/401", display401);

//api receive endpoint
router.post(apiDisplayer, apiEndpointController);

//-----------------------------

//poll backend
router.post("/polling-route", requireAuth, pollingController);



router.post("/update-data-route", requireAuth, updateDataController);

router.post("/get-backend-value-route", requireAuth, getBackendValueController);

router.post(adminCurrentDataRoute, requireAdminAuth, adminCurrentDataController);

//send data to scraper
router.post(adminCommandRoute, requireAdminAuth, adminCommandController);

router.use("/admin", requireAdminAuth, adminDisplay);

router.get("/", requireAuth, mainDisplay);

router.use(display404);

router.use(display500);

export default router;
