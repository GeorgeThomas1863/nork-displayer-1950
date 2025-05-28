import { expandBackendData } from "./main.js";
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

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const eventElement = e.target;
  const eventElementId = eventElement.id;
  const eventClosest = e.target.closest(".collapse-header");
  const expandType = eventElement.getAttribute("data-expand");

  console.log("!!!!!!EVENT ELEMENT", eventElement);
  console.log("!!!!!!EVENT ELEMENT ID", eventElementId);
  console.log("!!!!!!EXPAND TYPE", expandType);
  console.log("!!!!!!EVENT CLOSEST", eventClosest);

  // let dataType = "";
  // switch (expandType) {
  //   case "article-dropdown":
  //     dataType = "article";
  //     break;

  //   case "pic-dropdown":
  //     dataType = "pic";
  //     break;

  //   case "vid-dropdown":
  //     dataType = "vid";
  //     break;

  //   default:
  //     console.log("INPUT FUCKED");
  //     return null;
  // }

  // await expandBackendData(dataType);
};

//-----------------------------------

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
