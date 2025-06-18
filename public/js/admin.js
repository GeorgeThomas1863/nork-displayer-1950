import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { buildAdminBackendDisplay } from "./admin/admin-return.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async (isFirstLoad = true, inputObj = null) => {
  // export const buildAdminDisplay = async (isFirstLoad = true, scrapeId = null, textStr = null) => {
  if (!adminDisplayElement) return null;
  const { scrapeId, textStr } = inputObj ?? {}; //sets items to null if inputObj null

  //build the form
  const adminFormData = await buildAdminForm();
  adminDisplayElement.append(adminFormData);

  //get data first
  const params = {
    route: "/get-admin-backend-data-route",
    isFirstLoad: isFirstLoad,
    scrapeId: scrapeId,
  };

  const adminBackendRaw = await sendToBack(params);
  if (!adminBackendRaw) return null;
  adminBackendRaw.textStr = textStr;
  const adminBackendData = await buildAdminBackendDisplay(adminBackendRaw);

  //if first laod just return appended data
  if (isFirstLoad) return adminDisplayElement.append(adminFormData, adminBackendData);

  if (adminDisplayElement.children[2]) {
    adminDisplayElement.children[2].remove();
  }

  const existingBackendElement = document.getElementById("admin-backend-container");
  existingBackendElement.replaceWith(adminBackendData);

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
  await buildAdminDisplay(false, adminSubmitObj);
};

buildAdminDisplay();
