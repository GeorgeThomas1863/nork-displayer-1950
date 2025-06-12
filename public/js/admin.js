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

  adminDisplayElement.append(adminFormWrapper, backendAdminWrapper);

  return "#DONE";
};

export const getNewAdminData = async () => {
  //get user input
  const adminParams = await buildAdminParams();
  adminParams.isFirstLoad = false;
  adminParams.route = "/get-admin-backend-data-route";

  const adminDataObj = await sendToBack(adminParams);

  return adminDataObj;
};

buildAdminDisplay();
