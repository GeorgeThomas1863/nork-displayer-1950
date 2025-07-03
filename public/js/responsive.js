import { buildDisplay, toggleDropdown, expandForm } from "./main.js";
import { buildAdminDisplay } from "./admin.js";
import { debounce } from "./util.js";
import { updateStateEventTriggered, updateAdminStateEventTriggered } from "./state.js";
import { checkChangeTriggered, checkInputTriggered } from "./check-data.js";

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

  await buildDisplay();
};

//-----------------------------------

//ADMIN RESPONSIVE

export const adminClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickType = clickElement.getAttribute("type");

  console.log("CLICK TYPE");
  console.log(clickType);

  if (clickType !== "submit") return null;

  await updateAdminStateEventTriggered(clickType);

  //run thing
  // console.log("AHHHHHHHHHHH");
  await buildAdminDisplay();

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
  adminDisplayElement.addEventListener("click", adminClickHandler);
}
