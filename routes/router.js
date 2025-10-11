import express from "express";

import CONFIG from "../config/config.js";
import { requireAuth, requireAdminAuth } from "./auth.js";
import { authController, adminAuthController } from "../controllers/auth-controller.js";
import { mainDisplay, adminDisplay, display404, display500, display401 } from "../controllers/display-controller.js";
import { getBackendValueController, apiEndpointController, sendAdminCommandController, pollingController } from "../controllers/api-controller.js";

const { adminAuthRoute, sendAdminCommandRoute, apiDisplayer } = CONFIG;

const router = express.Router();

// Login AUTH route
router.post("/site-auth-route", authController);
router.post(adminAuthRoute, adminAuthController);
router.get("/401", display401);

//-----------------------------

//api receive endpoint
router.post(apiDisplayer, requireAuth, apiEndpointController);

//poll backend
router.post("/polling-route", requireAuth, pollingController);

//send data to scraper
router.post(sendAdminCommandRoute, requireAuth, sendAdminCommandController);

router.post("/get-backend-value-route", requireAuth, getBackendValueController);

router.use("/admin", requireAdminAuth, adminDisplay);

router.get("/", requireAuth, mainDisplay);

router.use(display404);

router.use(display500);

export default router;
