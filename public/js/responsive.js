import { runAuth, runAdminAuth, runAdminCommand, runPwToggle, runDropDownToggle, runAdminToggleURL, runChangeButtonType, runChangeDataType, runChangeDataInput } from "./run.js";
import debounce from "./util/debounce.js";

export const clickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const clickType = clickElement.getAttribute("data-label");

  const clickUpdate = clickElement.getAttribute("data-update");

  console.log("CLICK ELEMENT");
  console.log(clickElement);
  console.log("CLICK ID");
  console.log(clickId);
  console.log("CLICK TYPE");
  console.log(clickType);
  console.log("CLICK UPDATE");
  console.log(clickUpdate);

  if (clickType === "pwToggle") await runPwToggle();
  if (clickType === "auth-submit") await runAuth();
  if (clickType === "admin-auth-submit") await runAdminAuth();
  if (clickType === "admin-command-submit") await runAdminCommand();
  if (clickType === "dropdown") await runDropDownToggle();
  if (clickType === "admin-redirect") window.location.href = "/admin";

  //----------

  // if (clickUpdate) await runUpdateStateDisplay(clickUpdate);
  if (clickUpdate && clickUpdate.includes("-type-button-")) await runChangeButtonType(clickUpdate);
  if (clickUpdate && clickUpdate.includes("get-")) await runChangeDataType(clickUpdate);

  //   await updateAdminStateEventTriggered(clickType);

  //   //run thing
  //   // console.log("AHHHHHHHHHHH");
  //   await buildAdminDisplay();

  //   return "DONE";
};

export const keyHandler = async (e) => {
  if (e.key !== "Enter") return null;
  e.preventDefault();

  // Determine which button to trigger based on context
  const authButton = document.getElementById("auth-button");
  const adminAuthButton = document.getElementById("admin-auth-button");

  // Check if auth button is visible and enabled (user is on auth screen)
  if (authButton && authButton.offsetParent !== null && !authButton.disabled) return await runAuth();

  if (adminAuthButton && adminAuthButton.offsetParent !== null && !adminAuthButton.disabled) return await runAdminAuth();

  //make so only submits on click
  // if (visitSubmitButton && visitSubmitButton.offsetParent !== null && !visitSubmitButton.disabled) return await runSetDataWS();

  return null;
};

export const changeHandler = async (e) => {
  e.preventDefault();
  const changeElement = e.target;
  const changeId = changeElement.id;

  //   console.log("CHANGE ELEMENT");
  //   console.log(changeElement);

  //   console.log("CHANGE ID");
  //   console.log(changeId);

  if (changeId !== "admin-how-much") return null;

  await runAdminToggleURL();
};

// create debounced function for input
const debouncedInputTriggered = debounce(runChangeDataInput);

//input handler
export const inputHandler = async (e) => {
  const inputElement = e.target;

  const inputId = inputElement.id;

  const eventTriggered = await debouncedInputTriggered(inputId);
  if (!eventTriggered) return null;
};

const authElement = document.getElementById("auth-element");
const adminAuthElement = document.getElementById("admin-auth-element");
const displayElement = document.getElementById("display-element");
const adminDisplayElement = document.getElementById("admin-display-element");

if (authElement) {
  authElement.addEventListener("click", clickHandler);
  authElement.addEventListener("keydown", keyHandler);
}

if (adminAuthElement) {
  adminAuthElement.addEventListener("click", clickHandler);
  adminAuthElement.addEventListener("keydown", keyHandler);
}

if (displayElement) {
  displayElement.addEventListener("click", clickHandler);
  displayElement.addEventListener("keydown", keyHandler);
  displayElement.addEventListener("input", inputHandler);
}

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", clickHandler);
  adminDisplayElement.addEventListener("change", changeHandler);
}
