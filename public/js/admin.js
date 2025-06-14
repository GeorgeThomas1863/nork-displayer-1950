import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { buildAdminBackendDefault } from "./build-backend.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async () => {
  if (!adminDisplayElement) return null;

  const adminFormWrapper = await buildAdminForm();

  const params = {
    route: "/get-admin-backend-data-route",
    isFirstLoad: true,
  };

  const backendAdminWrapper = await buildAdminBackendDefault(params);
  backendAdminWrapper.id = "backend-admin-wrapper";

  adminDisplayElement.append(adminFormWrapper, backendAdminWrapper);

  return "#DONE";
};

export const getNewAdminData = async () => {
  //get user input
  const adminParams = await buildAdminParams();

  //send submit first
  adminParams.route = "/admin-submit-route";
  const adminSubmitObj = await sendToBack(adminParams);

  //GET SCRAPE ID FROOM ADMIN SUBMIT
  const backendParams = {
    scrapeId: adminSubmitObj.scrapeId,
    isFirstLoad: false,
    route: "/get-admin-backend-data-route",
  };

  const adminBackendObj = await sendToBack(backendParams);

  const adminObj = { ...adminSubmitObj, ...adminBackendObj };

  return adminObj;
};

buildAdminDisplay();
