import { adminState, updateAdminStateDataLoaded } from "./state.js";
import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { buildAdminBackendDisplay } from "./admin/admin-return.js";
import { checkNewDataNeededAdmin } from "./check-data.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async () => {
  if (!adminDisplayElement) return null;
  const { isFirstLoad } = adminState;

  if (isFirstLoad) {
    const adminFormData = await buildAdminForm();
    adminDisplayElement.append(adminFormData);
  }

  const newDataNeededAdmin = await checkNewDataNeededAdmin();
  if (!newDataNeededAdmin) return null;

  const adminBackendData = await sendToBack(adminState);
  if (!adminBackendData) return null;

  console.log("ADMIN BACKEND DATA");
  console.log(adminBackendData);

  const adminBackendDataParsed = await buildAdminBackendDisplay(adminBackendData);
  //on fail
  if (!adminBackendDataParsed) {
    await adminDisplayFail();
    return null;
  }

  adminDisplayElement.append(adminBackendDataParsed);

  await updateAdminStateDataLoaded(adminBackendData);

  //if first laod just return appended data
  // if (isFirstLoad) return adminDisplayElement.append(adminFormData, adminBackendData);

  // if (adminDisplayElement.children[2]) {
  //   adminDisplayElement.children[2].remove();
  // }

  // const existingBackendElement = document.getElementById("admin-backend-container");
  // existingBackendElement.replaceWith(adminBackendData);

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

//HERE
export const adminDisplayFail = async () => {
  const adminFailElement = document.createElement("h1");
  adminFailElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
  adminFailElement.id = "backend-data-fail";

  const adminBackendDataWrapperReplace = document.getElementById("admin-backend-container");
  if (!adminBackendDataWrapperReplace) {
    adminDisplayElement.append(adminFailElement);
  } else {
    adminDisplayElement.replaceChild(adminFailElement, adminBackendDataWrapperReplace);
  }

  return true;
};

buildAdminDisplay();
