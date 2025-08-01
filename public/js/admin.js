import { adminState, updateAdminStateDataLoaded } from "./util/state.js";
import { buildAdminForm } from "./admin/admin-form.js";
// import { buildAdminParams } from "./util.js";
import { sendToBack } from "./util/api-front.js";
import { buildAdminBackendDisplay } from "./admin/admin-return.js";
import { checkNewDataNeededAdmin } from "./util/check-data.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async () => {
  console.log("START ADMIN DISPLAY");

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
