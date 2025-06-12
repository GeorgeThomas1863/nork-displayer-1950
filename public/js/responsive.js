import { getNewData, expandBackendData, toggleDropdown } from "./main.js";
import { buildAdminParams, sendToBack, debounce } from "./util.js";
import { buildBackendNew } from "./build-backend.js";

export const adminSubmitClick = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickType = clickElement.getAttribute("type");

  console.log("THING CLICKED");
  console.log(clickElement);
  console.log(clickType);

  // if (clickType === "submit") {

  //get input params
  const adminParams = await buildAdminParams();

  console.log("ADMIN PARAMS", adminParams);

  //get data
  const adminData = await sendToBack(adminParams);
  console.log("ADMIN DATA", adminData);

  //BUILD ADMIN DISPLAYs

  return "DONE";
};

//---------------------------------

//MAKE A GET NEW DATA FUNCTION AND PARSE TYPE THERE

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const expandType = clickElement.getAttribute("data-expand");
  const toggleType = clickElement.getAttribute("data-toggle");

  // console.log("CLICK INFO");
  // console.log(clickElement);
  // console.log(clickId);
  // console.log(toggleType);

  if (toggleType) {
    await toggleDropdown(toggleType);
  }

  //handle expand / collapse backend data
  if (expandType) {
    await expandBackendData(expandType);
  }

  const clickObj = {
    clickId: clickId,
    expandType: expandType,
  };

  const newBackendData = await getNewData(clickObj);
  if (!newBackendData) return null;

  console.log("NEW BACKEND DATA");
  console.log(newBackendData);
  console.dir(newBackendData);

  await buildBackendNew(newBackendData);

  return true;
};

//create debounced function
const debouncedGetNewData = debounce(getNewData);

//input handler
export const mainInputHandler = async (e) => {
  const inputElement = e.target;

  const inputId = inputElement.id;

  const inputObj = {
    inputId: inputId,
  };

  const newBackendData = await debouncedGetNewData(inputObj);
  if (!newBackendData) return null;
  await buildBackendNew(newBackendData);

  return true;
};

//-----------------------------------

//ADMIN event listener
// const adminSubmitButton = document.getElementById("admin-submit-button");
// if (adminSubmitButton) {
//   adminSubmitButton.addEventListener("click", adminSubmitClick);
// }

const adminDisplayElement = document.getElementById("admin-display-element");
if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", adminSubmitClick);
}

//MAIN CLICK / INPUT listener
const displayElement = document.getElementById("display-element");
if (displayElement) {
  displayElement.addEventListener("click", mainClickHandler);
  displayElement.addEventListener("input", mainInputHandler);
}
