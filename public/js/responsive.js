import { buildAdminParams, sendToBack } from "./util.js";

export const adminSubmitClick = async (e) => {
  e.preventDefault();

  //get input params
  const adminParams = await buildAdminParams();

  console.log("ADMIN PARAMS", adminParams);

  //get data
  const adminData = await sendToBack(adminParams);

  console.log("ADMIN DATA", adminData);

  //display it (remove variable name)
  // const displayData = await displayAdminReturn(adminData);
  // console.log(displayData);

  // return "DONE";
};

//!!! HERE
//FIGURE OUT WHERE TO PUT THE DATA ACTION THING
//!!!

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const eventElement = e.target;
  const eventElementId = eventElement.id;
  const actionType = eventElement.getAttribute("data-action");

  console.log("AHHHHHHHHHHHH");
  console.log(eventElement);
  console.log(eventElementId);
  console.log(actionType);
};

//ADMIN event listener
const adminSubmitButton = document.getElementById("admin-submit-button");
if (adminSubmitButton) {
  adminSubmitButton.addEventListener("click", adminSubmitClick);
}

//MAIN event listener
const displayElement = document.getElementById("display-element");
if (displayElement) {
  displayElement.addEventListener("click", mainClickHandler);
}
