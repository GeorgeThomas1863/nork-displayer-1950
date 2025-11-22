import stateFront from "./util/state-front.js";
import { updateDisplay } from "./main.js";
import { getAuthParams } from "./util/params.js";
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
    // console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const runPwToggle = async () => {
  const pwButton = document.querySelector(".password-toggle-btn");
  const pwInput = document.querySelector(".password-input");

  // console.log(pwButton);
  // console.log(pwInput);
  const currentSvgId = pwButton.querySelector("svg").id;

  if (currentSvgId === "eye-closed-icon") {
    pwButton.innerHTML = EYE_OPEN_SVG;
    pwInput.type = "text";
    return true;
  }

  pwButton.innerHTML = EYE_CLOSED_SVG;
  pwInput.type = "password";
  return true;
};

export const runDropDownToggle = async () => {
  const dropDownButtonWrapper = document.getElementById("drop-down-button-wrapper");
  if (!dropDownButtonWrapper) return null;

  const isHidden = dropDownButtonWrapper.classList.contains("hidden");

  isHidden ? await unhideArray([dropDownButtonWrapper]) : await hideArray([dropDownButtonWrapper]);

  return true;
};

//--------------------------------

export const runChangeButtonType = async (clickUpdate) => {
  if (!clickUpdate) return null;

  const typePrefix = clickUpdate.split("-")[0];
  const typeId = clickUpdate.split("-").pop();

  // console.log("RUN CHANGE BUTTON TYPE");
  // console.log(typePrefix);
  // console.log(typeId);

  const currentActiveButton = document.querySelector(`#${typePrefix}-type-button-list .button-type-item.active`);
  if (currentActiveButton) currentActiveButton.classList.remove("active");

  //same type clicked
  if (!typeId || stateFront.articleType === typeId) return null;

  stateFront[`${typePrefix}Type`] = typeId;
  stateFront.eventTrigger = `${typePrefix}-type-button-click`;
  stateFront.typeTrigger = `${typePrefix}s`;

  await updateDisplay();

  const newArticleTypeButton = document.getElementById(`${typePrefix}-type-button-${typeId}`);
  if (newArticleTypeButton) newArticleTypeButton.classList.add("active");
  return true;
};

export const runChangeDataType = async (clickUpdate) => {
  if (!clickUpdate) return null;

  const dataType = clickUpdate.split("-").pop();

  //same type clicked
  if (!dataType || dataType === stateFront.typeTrigger) return null;

  stateFront.typeTrigger = dataType;
  stateFront.eventTrigger = `${dataType}-click`;

  //update / keep selections
  const howManyElement = document.getElementById(`${dataType.slice(0, -1)}-how-many`);
  stateFront.howMany = howManyElement?.value || null;

  const sortByElement = document.getElementById(`${dataType.slice(0, -1)}-sort-by`);
  stateFront.orderBy = sortByElement?.value.substring(sortByElement?.value.indexOf("-") + 1) || "newest-to-oldest";

  await updateDisplay();
  return true;
};

export const runChangeHowMany = async (inputElement) => {
  if (!inputElement) return null;

  const typePrefix = inputElement.id.split("-")[0];
  const inputHowMany = inputElement.value;

  //get current data
  if (stateFront.typeTrigger === "articles") {
    const currentArticles = stateFront.dataObj.articles[stateFront.articleType];
    if (currentArticles && currentArticles === inputHowMany) return null;
  }
  const currentItems = stateFront.dataObj[stateFront.typeTrigger];
  if (currentItems && currentItems === inputHowMany) return null;

  stateFront.eventTrigger = inputElement.id;
  stateFront.howMany = inputHowMany;
  stateFront.typeTrigger = `${typePrefix}s`;

  // const updateNeeded = await checkUpdateNeeded();
  // if (!updateNeeded) return false;

  await updateDisplay();
  return true;
};

export const runChangeSortBy = async (changeElement) => {
  if (!changeElement) return null;

  const changeId = changeElement.id;
  const sortByRaw = changeElement.value;
  const sortBy = sortByRaw.substring(sortByRaw.indexOf("-") + 1);
  const typePrefix = changeId.split("-")[0];

  // console.log("RUN CHANGE SORT BY");

  // console.log(sortBy);
  // console.log(typePrefix);

  if (!sortBy || sortBy === stateFront.orderBy) return null;

  stateFront.eventTrigger = changeId;
  stateFront.typeTrigger = `${typePrefix}s`;
  stateFront.orderBy = sortBy;

  await updateDisplay();
  return true;
};
