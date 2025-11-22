// import stateAdmin from "./admin/admin-state.js";
import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminReturnDisplay } from "./admin/admin-return.js";
import { sendToBack } from "./util/api-front.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async () => {
  if (!adminDisplayElement) return null;
  // const { isFirstLoad } = stateAdmin;

  const adminFormData = await buildAdminForm();
  adminDisplayElement.append(adminFormData);

  await updateAdminDisplay();

  return true;
};

export const updateAdminDisplay = async () => {
  if (!adminDisplayElement) return null;

  const currentAdminDataElement = document.getElementById("admin-return-container");
  if (currentAdminDataElement) currentAdminDataElement.remove();

  const adminDataRoute = await sendToBack({ route: "/get-backend-value-route", key: "adminDataRoute" });
  if (!adminDataRoute) return null;

  // const adminUpdateArray = await sendToBack({ route: adminDataRoute.value, stateAdmin: stateAdmin });
  const adminUpdateArray = await sendToBack({ route: adminDataRoute.value });
  // console.log("ADMIN UPDATE ARRAY");
  // console.dir(adminUpdateArray);

  const adminReturnDisplay = await buildAdminReturnDisplay(adminUpdateArray);
  if (!adminReturnDisplay) return null;

  adminDisplayElement.append(adminReturnDisplay);
};

buildAdminDisplay();
