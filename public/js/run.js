import stateFront from "./util/state-front.js";
import { checkUpdateNeeded } from "./util/state-front.js";
import { updateDisplay } from "./main.js";
import { getAuthParams, getAdminAuthParams, getAdminCommandParams } from "./util/params.js";
import { sendToBack } from "./util/api-front.js";
import { hideArray, unhideArray } from "./util/collapse-display.js";
import { EYE_OPEN_SVG, EYE_CLOSED_SVG } from "./util/define-things.js";

export const runAuth = async () => {
  try {
    const authParams = await getAuthParams();
    authParams.route = "/site-auth-route";
    const authData = await sendToBack(authParams);
    if (!authData || !authData.redirect) return null;

    window.location.href = authData.redirect;
    return authData;
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

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

export const runPwToggle = async () => {
  const pwButton = document.querySelector(".password-toggle-btn");
  const pwInput = document.querySelector(".password-input");

  console.log(pwButton);
  console.log(pwInput);
  const currentSvgId = pwButton.querySelector("svg").id;

  if (currentSvgId === "eye-closed-icon") {
    pwButton.innerHTML = EYE_OPEN_SVG;
    pwInput.type = "text";
  } else {
    pwButton.innerHTML = EYE_CLOSED_SVG;
    pwInput.type = "password";
  }

  return true;
};

export const runDropDownToggle = async () => {
  const dropDownButtonWrapper = document.getElementById("drop-down-button-wrapper");
  if (!dropDownButtonWrapper) return null;

  const isHidden = dropDownButtonWrapper.classList.contains("hidden");

  isHidden ? await unhideArray([dropDownButtonWrapper]) : await hideArray([dropDownButtonWrapper]);

  return true;
};

export const runAdminToggleURL = async () => {
  const howMuchElement = document.getElementById("admin-how-much");
  const urlListItem = document.getElementById("admin-url-input-list-item");
  if (!howMuchElement || !urlListItem) return null;

  howMuchElement.value === "admin-scrape-url" ? unhideArray([urlListItem]) : hideArray([urlListItem]);

  return true;
};

//--------------------------------

export const runChangeButtonType = async (clickUpdate) => {
  console.log("RUN UPDATE STATE DISPLAY");
  console.log(clickUpdate);

  const typePrefix = clickUpdate.split("-")[0];
  const typeId = clickUpdate.split("-").pop();

  const currentActiveButton = document.querySelector(`#${typePrefix}-type-button-list .button-type-item.active`);
  if (currentActiveButton) currentActiveButton.classList.remove("active");

  stateFront[`${typePrefix}Type`] = typeId;
  stateFront.eventTrigger = `${typePrefix}-type-button-click`;
  stateFront.typeTrigger = `${typePrefix}s`;

  await updateDisplay();

  const newArticleTypeButton = document.getElementById(`${typePrefix}-type-button-${typeId}`);
  if (newArticleTypeButton) newArticleTypeButton.classList.add("active");
  return true;
};

export const runChangeDataType = async (clickUpdate) => {
  console.log("RUN CHANGE DATA TYPE");
  console.log(clickUpdate);

  const dataType = clickUpdate.split("-").pop();

  stateFront.typeTrigger = dataType;
  stateFront.eventTrigger = "data-type-click";

  await updateDisplay();
  return true;
};

export const runChangeDataInput = async (inputId) => {
  const inputElement = document.getElementById(inputId);
  if (!inputElement) return null;

  console.log("INPUT ID");
  console.log(inputId);
  console.log("INPUT ELEMENT");
  console.log(inputElement);
  console.log("INPUT VALUE");
  console.log(inputElement.value);

  await checkUpdateNeeded();

  return true;
};
