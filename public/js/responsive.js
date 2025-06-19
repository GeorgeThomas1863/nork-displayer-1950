import { expandBackendData, toggleDropdown } from "./main.js";
import { getNewAdminData } from "./admin.js";
import { debounce } from "./util.js";
import { buildBackendNew } from "./build-backend.js";
import { checkChangeTriggered, newDataTrigger } from "./state.js";

//MAIN / NORMAL RESPONSIVE

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const expandType = clickElement.getAttribute("data-expand");
  const toggleType = clickElement.getAttribute("data-toggle");

  if (toggleType) {
    await toggleDropdown(toggleType);
  }

  //handle expand / collapse backend data
  if (expandType) {
    await expandBackendData(expandType);
  }

  // const clickObj = {
  //   clickId: clickId,
  //   expandType: expandType,
  // };

  // const newBackendData = await getNewData(clickObj);
  // if (!newBackendData) return null;

  // console.log("NEW BACKEND DATA");
  // console.log(newBackendData);

  // await buildBackendNew(newBackendData);

  return true;
};

export const mainChangeHandler = async (e) => {
  e.preventDefault();
  const changeElement = e.target;
  const changeId = changeElement.id;
  console.log("CHANGE ELEMENT");
  console.log(e);
  console.log(changeElement);
  console.log(changeId);

  const changeTriggered = await checkChangeTriggered(changeId);
  if (!changeTriggered) return null;

  const newDataNeeded = await newDataTrigger();

  //if needed get new data

  //otherwise hide / unhide things


};

//create debounced function
// const debouncedGetNewData = debounce(getNewData);

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

//ADMIN RESPONSIVE

export const adminSubmitClick = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickType = clickElement.getAttribute("type");

  if (clickType !== "submit") return null;

  //run thing
  console.log("AHHHHHHHHHHH");
  await getNewAdminData();

  return "DONE";
};

// ------------------------------------

//CLICK / INPUT LISTENERS
const adminDisplayElement = document.getElementById("admin-display-element");
const displayElement = document.getElementById("display-element");

if (displayElement) {
  displayElement.addEventListener("click", mainClickHandler);
  displayElement.addEventListener("input", mainInputHandler);
  displayElement.addEventListener("change", mainChangeHandler);
}

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", adminSubmitClick);
}
