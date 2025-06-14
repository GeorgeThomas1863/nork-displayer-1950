import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { buildAdminBackendDisplay } from "./admin/admin-return.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async (isFirstLoad = true, scrapeId = null) => {
  if (!adminDisplayElement) return null;

  //get data first
  const params = {
    route: "/get-admin-backend-data-route",
    isFirstLoad: isFirstLoad,
    scrapeId: scrapeId,
  };

  const adminBackendRaw = await sendToBack(params);
  const adminBackendData = await buildAdminBackendDisplay(adminBackendRaw);
  const adminFormData = await buildAdminForm();

  //append / display the data
  switch (isFirstLoad) {
    case true:
      adminDisplayElement.append(adminFormData, adminBackendData);
      break;

    case false:
      // const adminBackendContainer = document.getElementById("admin-backend-container");
      //try resetting the display
      console.log("ADMIN BACKEND DATA");
      console.log(adminBackendData);

      adminDisplayElement.innerHTML = "";
      adminDisplayElement.append(adminFormData, adminBackendData);

      // console.log("ADMINN DISPLAY ELEMENT");
      // console.log(adminDisplayElement);
      // console.log("ADMIN BACKEND DATA");
      // console.log(adminBackendData);
      // adminDisplayElement.replaceChild(adminDisplayElement.children[1], adminBackendData);
      break;
  }

  //create the fucking element
  // const backendAdminWrapper = document.createElement("div");
  // backendAdminWrapper.id = "backend-admin-wrapper";

  // //attempt to be less stupid with data display
  // if (isFirstLoad) {
  //   backendAdminWrapper.append(adminBackendData);
  // } else {
  //   backendAdminWrapper.replaceChild(adminBackendData, backendAdminWrapper.firstElementChild);
  // }

  //attempt to be less stupid with data display
  // if (isFirstLoad) {
  // } else {
  // }

  // adminDisplayElement.append(adminFormData, backendAdminWrapper);

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
