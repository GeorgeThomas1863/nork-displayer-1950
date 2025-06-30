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

  const adminBackendDisplay = await buildAdminBackendDisplay(adminBackendData);
  adminBackendDisplay.id = "admin-backend-display";

  //on fail
  if (!adminBackendDisplay) {
    await adminDisplayFail();
    return null;
  }

  adminDisplayElement.append(adminBackendDisplay);

  await updateAdminStateDataLoaded(adminBackendData);

  return "#DONE";
};

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
