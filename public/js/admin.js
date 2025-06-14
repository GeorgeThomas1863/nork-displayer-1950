import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { buildAdminBackendDisplay } from "./build-backend.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async (isFirstLoad = true, scrapeId = null) => {
  if (!adminDisplayElement) return null;

  const adminFormWrapper = await buildAdminForm();

  const params = {
    route: "/get-admin-backend-data-route",
    isFirstLoad: isFirstLoad,
    scrapeId: scrapeId,
  };

  const adminBackendRaw = await sendToBack(params);
  const adminBackendParsed = await buildAdminBackendDisplay(adminBackendRaw);

  console.log("ADMIN BACKEND DATA PARSED");
  console.log(adminBackendParsed);

  //create the fucking element
  const backendAdminWrapper = document.createElement("div");
  backendAdminWrapper.id = "backend-admin-wrapper";
  backendAdminWrapper.append(adminBackendParsed);

  adminDisplayElement.append(adminFormWrapper, backendAdminWrapper);

  return "#DONE";
};

export const getNewAdminData = async () => {
  //get user input
  const adminParams = await buildAdminParams();

  //send submit first
  adminParams.route = "/admin-submit-route";
  const adminSubmitObj = await sendToBack(adminParams);
  if (!adminSubmitObj || !adminSubmitObj.scrapeId) return null;

  //build the display
  await buildAdminDisplay(false, adminSubmitObj.scrapeId);
};

buildAdminDisplay();
