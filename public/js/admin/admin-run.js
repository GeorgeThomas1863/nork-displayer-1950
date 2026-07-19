import { updateAdminDisplay } from "../admin.js";
import { buildAdminStatusDisplay } from "./admin-status.js";
import { getAdminAuthParams, getAdminCommandParams } from "../util/params.js";
import { sendToBack } from "../util/api-front.js";
import { hideArray, unhideArray } from "../util/collapse-display.js";

let commandGeneration = 0;
let statusTimerId = null;
let refreshTimerId = null;

export const runAdminAuth = async () => {
  try {
    const adminAuthParams = await getAdminAuthParams();
    if (!adminAuthParams) return null;
    adminAuthParams.route = "/nork-admin-auth-route";

    const authData = await sendToBack(adminAuthParams);
    if (!authData || !authData.redirect) return null;

    window.location.href = authData.redirect;
    return authData;
  } catch (e) {
    console.error("ERROR:", e.message);
    return null;
  }
};

export const runAdminCommand = async () => {
  const adminCommandParams = await getAdminCommandParams();
  if (!adminCommandParams) return null;

  const generation = beginCommandGeneration();
  scheduleStatusUpdate(adminCommandParams.scrapeId, generation);
  scheduleAdminDisplayUpdate(generation);

  try {
    const commandResult = await sendAdminCommand(adminCommandParams);
    await renderCurrentStatus(commandResult, generation);
    await refreshCurrentAdminDisplay(generation);
    return commandResult;
  } catch (e) {
    console.error("ADMIN COMMAND ERROR:", e.message);
    const failure = buildRequestFailure("Unable to run admin command");
    await renderCurrentStatus(failure, generation);
    await refreshCurrentAdminDisplay(generation);
    return failure;
  }
};

const beginCommandGeneration = () => {
  commandGeneration += 1;
  clearScheduledUpdates();
  return commandGeneration;
};

const clearScheduledUpdates = () => {
  if (statusTimerId !== null) clearTimeout(statusTimerId);
  if (refreshTimerId !== null) clearTimeout(refreshTimerId);
  statusTimerId = null;
  refreshTimerId = null;
};

const sendAdminCommand = async (adminCommandParams) => {
  return sendToBack({ ...adminCommandParams, route: "/nork-admin-command-route" });
};

const scheduleStatusUpdate = (scrapeId, generation) => {
  statusTimerId = setTimeout(() => requestAndRenderStatus(scrapeId, generation), 1000);
};

const requestAndRenderStatus = async (scrapeId, generation) => {
  try {
    const statusParams = { route: "/nork-admin-polling-route", scrapeId };
    const statusResult = await sendToBack(statusParams);
    await renderCurrentStatus(statusResult, generation);
  } catch (e) {
    console.error("ADMIN STATUS ERROR:", e.message);
    const failure = buildRequestFailure("Unable to retrieve scraper status");
    await renderCurrentStatus(failure, generation);
  }
};

const scheduleAdminDisplayUpdate = (generation) => {
  refreshTimerId = setTimeout(() => refreshCurrentAdminDisplay(generation), 3000);
};

const refreshCurrentAdminDisplay = async (generation) => {
  if (!isCurrentGeneration(generation)) return;
  try {
    await updateAdminDisplay(() => isCurrentGeneration(generation));
  } catch (e) {
    console.error("ADMIN DISPLAY ERROR:", e.message);
    const failure = buildRequestFailure("Unable to refresh admin display");
    await renderCurrentStatus(failure, generation);
  }
};

const renderCurrentStatus = async (result, generation) => {
  if (!isCurrentGeneration(generation)) return false;
  try {
    await buildAdminStatusDisplay(result);
    return true;
  } catch (e) {
    console.error("ADMIN STATUS DISPLAY ERROR:", e.message);
    return false;
  }
};

const isCurrentGeneration = (generation) => generation === commandGeneration;

const buildRequestFailure = (message) => {
  return { success: false, message, data: { status: 503 } };
};

//---------------------

export const runAdminToggleURL = async () => {
  const howMuchElement = document.getElementById("admin-how-much");
  const urlListItem = document.getElementById("admin-url-input-list-item");
  if (!howMuchElement || !urlListItem) return null;

  howMuchElement.value === "admin-scrape-url" ? unhideArray([urlListItem]) : hideArray([urlListItem]);

  return true;
};

export const runAdminUpdateData = async () => {
  const currentAdminDataElement = document.getElementById("admin-return-container");
  if (!currentAdminDataElement) return null;

  await updateAdminDisplay();
  return true;
};
