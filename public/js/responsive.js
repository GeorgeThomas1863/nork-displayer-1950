import { expandBackendData, toggleDropdown } from "./main.js";
import { getNewAdminData } from "./admin.js";
import { debounce } from "./util.js";
import { buildBackendNew } from "./build-backend.js";

//MAIN / NORMAL RESPONSIVE

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const expandType = clickElement.getAttribute("data-expand");
  const toggleType = clickElement.getAttribute("data-toggle");

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

  // const newBackendData = await getNewData(clickObj);
  // if (!newBackendData) return null;

  // console.log("NEW BACKEND DATA");
  // console.log(newBackendData);

  // await buildBackendNew(newBackendData);

  return true;
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
}

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", adminSubmitClick);
}
