import { runAuth, runAdminCommand, runPwToggle } from "./run.js";

import { getAdminCommandParams } from "./util/params.js";
import { changeAdminForm } from "./forms/form-change.js";
import { sendToBack } from "./util/api-front.js";

export const adminClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const clickType = clickElement.getAttribute("type");

  console.log("CLICK ID");
  console.log(clickId);
  console.log("CLICK TYPE");
  console.log(clickType);

  if (clickType === "pwToggle") await runPwToggle();
  if (clickType === "auth-submit") await runAuth();
  if (clickType === "admin-command-submit") await runAdminCommand();

  //   await updateAdminStateEventTriggered(clickType);

  //   //run thing
  //   // console.log("AHHHHHHHHHHH");
  //   await buildAdminDisplay();

  //   return "DONE";
};

export const adminChangeHandler = async (e) => {
  e.preventDefault();
  const changeElement = e.target;
  const changeId = changeElement.id;

  //   console.log("CHANGE ELEMENT");
  //   console.log(changeElement);

  //   console.log("CHANGE ID");
  //   console.log(changeId);

  if (changeId !== "admin-how-much") return null;

  await changeAdminForm();

  //check if event triggered, move on if not
  // const eventTriggered = await checkChangeTriggered(changeId);
  // if (!eventTriggered) return null;

  // //update the state
  // await updateStateEventTriggered(changeId, eventTriggered);

  // //build display
  // await buildDisplay();
};

const authElement = document.getElementById("auth-element");
const adminDisplayElement = document.getElementById("admin-display-element");
const displayElement = document.getElementById("display-element");

if (authElement) {
  authElement.addEventListener("click", clickHandler);
  authElement.addEventListener("keydown", keyHandler);
}

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", adminClickHandler);
  adminDisplayElement.addEventListener("change", adminChangeHandler);
}

if (displayElement) {
  //BUILD
}
