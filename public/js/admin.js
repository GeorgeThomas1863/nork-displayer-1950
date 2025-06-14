import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { buildAdminBackendDisplay } from "./admin/admin-return.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async (isFirstLoad = true, scrapeId = null) => {
  if (!adminDisplayElement) return null;

  const adminFormData = await buildAdminForm();
  adminDisplayElement.append(adminFormData);

  //get data first
  const params = {
    route: "/get-admin-backend-data-route",
    isFirstLoad: isFirstLoad,
    scrapeId: scrapeId,
  };

  const adminBackendRaw = await sendToBack(params);
  const adminBackendData = await buildAdminBackendDisplay(adminBackendRaw);

  //if first laod just append data
  if (isFirstLoad) {
    adminDisplayElement.append(adminFormData, adminBackendData);
    console.log("ADMIN DISPLAY ELEMENT CHILDREN");
    console.log(adminDisplayElement.children.length);
    return;
  }

  console.log("ADMIN DISPLAY ELEMENT CHILDREN");
  console.log(adminDisplayElement.children.length);

  if (adminDisplayElement.children[2]) {
    adminDisplayElement.children[2].remove();
  }
  
  //otherwise replace data
  adminDisplayElement.children[1].remove();

  adminDisplayElement.append(adminBackendData.children[0], adminBackendData.children[1]);
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
