import { getAdminAuthParams, getAdminCommandParams } from "../util/params.js";
import { sendToBack } from "../util/api-front.js";
import { hideArray, unhideArray } from "../util/collapse-display.js";

export const runAdminAuth = async () => {
  try {
    const adminAuthParams = await getAdminAuthParams();
    const adminAuthRoute = await sendToBack({ route: "/get-backend-value-route", key: "adminAuthRoute" });
    if (!adminAuthParams || !adminAuthRoute) return null;
    adminAuthParams.route = adminAuthRoute.value;

    const authData = await sendToBack(adminAuthParams);
    if (!authData || !authData.redirect) return null;

    window.location.href = authData.redirect;
    return authData;
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const runAdminCommand = async () => {
  try {
    const adminCommandParams = await getAdminCommandParams();
    const adminCommandRoute = await sendToBack({ route: "/get-backend-value-route", key: "adminCommandRoute" });
    if (!adminCommandParams || !adminCommandRoute) return null;
    adminCommandParams.route = adminCommandRoute.value;

    console.log("ADMIN COMMAND PARAMS");
    console.dir(adminCommandParams);

    const data = await sendToBack(adminCommandParams);
    console.log("ADMIN COMMAND DATA");
    console.dir(data);
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const runAdminToggleURL = async () => {
  const howMuchElement = document.getElementById("admin-how-much");
  const urlListItem = document.getElementById("admin-url-input-list-item");
  if (!howMuchElement || !urlListItem) return null;

  howMuchElement.value === "admin-scrape-url" ? unhideArray([urlListItem]) : hideArray([urlListItem]);

  return true;
};
