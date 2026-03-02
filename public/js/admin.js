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

  // const adminUpdateArray = await sendToBack({ route: "/nork-admin-data-route", stateAdmin: stateAdmin });
  const adminUpdateArray = await sendToBack({ route: "/nork-admin-data-route" });
  // console.log("ADMIN UPDATE ARRAY");
  // console.dir(adminUpdateArray);

  const adminReturnDisplay = await buildAdminReturnDisplay(adminUpdateArray);
  if (!adminReturnDisplay) return null;

  adminDisplayElement.append(adminReturnDisplay);
};

buildAdminDisplay();
