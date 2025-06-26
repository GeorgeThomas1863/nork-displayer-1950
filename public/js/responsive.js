import d from "./define-things.js";
import { buildDisplay, toggleDropdown, expandForm } from "./main.js";
import { getNewAdminData } from "./admin.js";
import { debounce, buildInputParams } from "./util.js";
import { state, checkChangeTriggered, checkInputTriggered, updateStateEventTriggered } from "./state.js";

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
    await expandForm(expandType);
  }

  return true;
};

export const mainChangeHandler = async (e) => {
  e.preventDefault();
  const changeElement = e.target;
  const changeId = changeElement.id;

  //check if event triggered, move on if not
  const eventTriggered = await checkChangeTriggered(changeId);
  if (!eventTriggered) return null;

  //update the state
  await updateStateEventTriggered(changeId, eventTriggered);

  //build display
  await buildDisplay();
};

// create debounced function for input
const debouncedInputTriggered = debounce(checkInputTriggered);

//input handler
export const mainInputHandler = async (e) => {
  const inputElement = e.target;

  const inputId = inputElement.id;

  const eventTriggered = await debouncedInputTriggered(inputId);
  if (!eventTriggered) return null;

  await updateStateEventTriggered(inputId, eventTriggered);

  // console.log("INPUT TRIGGERED STATE");
  // console.dir(state);

  await buildDisplay();
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
  displayElement.addEventListener("change", mainChangeHandler);
  displayElement.addEventListener("input", mainInputHandler);
}

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", adminSubmitClick);
}
