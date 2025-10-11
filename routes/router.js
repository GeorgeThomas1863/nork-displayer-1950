import express from "express";

import CONFIG from "../config/config.js";
import requireAuth from "./auth.js";
import { authController } from "../controllers/auth-controller.js";
import { mainDisplay, adminDisplay, display404, display500, display401 } from "../controllers/display-controller.js";

import { getBackendValueController, apiEndpointController, sendAdminCommandController, pollingController } from "../controllers/api-controller.js";

const router = express.Router();

// Login AUTH route
router.post("/site-auth-route", authController);
router.get("/401", display401);

//-----------------------------

//api receive endpoint
router.post(CONFIG.apiDisplayer, requireAuth, apiEndpointController);

//poll backend
router.post("/polling-route", requireAuth, pollingController);

//send data to scraper
router.post("/send-admin-command-route", requireAuth, sendAdminCommandController);

router.post("/get-backend-value-route", requireAuth, getBackendValueController);

router.get("/", requireAuth, mainDisplay);

router.use("/admin", requireAuth, adminDisplay);

router.use(display404);

router.use(display500);

export default router;
