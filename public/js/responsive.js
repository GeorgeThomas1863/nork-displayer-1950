import { expandBackendData } from "./main.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { getNewArticleData } from "./parse/parse-articles.js";

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
  const eventId = eventElement.id;
  const expandType = eventElement.getAttribute("data-expand");

  if (expandType) {
    await expandBackendData(expandType);
  }

  if (eventId === "article-type" || eventId === "article-sort-by") {
    await getNewArticleData();
  }

  console.log("!!!EVENT ID");
  console.log(eventId);
};

export const mainInputHandler = async (e) => {};

//-----------------------------------

//ADMIN event listener
const adminSubmitButton = document.getElementById("admin-submit-button");
if (adminSubmitButton) {
  adminSubmitButton.addEventListener("click", adminSubmitClick);
}

//MAIN CLICK listener
const displayElement = document.getElementById("display-element");
if (displayElement) {
  displayElement.addEventListener("click", mainClickHandler);
}

//get how many inputs
// const articleHowMany = document.getElementById("article-how-many");
// const picHowMany = document.getElementById("pic-how-many");
// const vidHowMany = document.getElementById("vid-how-many");
