import { expandBackendData } from "./main.js";
import { buildAdminParams, sendToBack } from "./util.js";
import { getNewArticleData } from "./parse/parse-articles.js";

import { debounce } from "./util.js";

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

  return "DONE";
};

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const expandType = clickElement.getAttribute("data-expand");

  if (expandType) {
    await expandBackendData(expandType);
  }

  if (clickId === "article-type" || clickId === "article-sort-by") {
    await getNewArticleData();
  }

  console.log("!!!EVENT ID");
  console.log(clickId);
};

//create debounced function
const debouncedGetNewArticleData = debounce(getNewArticleData);

export const mainInputHandler = async (e) => {
  const inputElement = e.target;

  const inputId = inputElement.id;
  const inputValue = inputElement.value;

  if (inputId === "article-how-many") {
    console.log("INPUT VALUE");
    console.log(inputValue);
    debouncedGetNewArticleData();
  }
};

//-----------------------------------

//ADMIN event listener
const adminSubmitButton = document.getElementById("admin-submit-button");
if (adminSubmitButton) {
  adminSubmitButton.addEventListener("click", adminSubmitClick);
}

//MAIN CLICK / INPUT listener
const displayElement = document.getElementById("display-element");
if (displayElement) {
  displayElement.addEventListener("click", mainClickHandler);
  displayElement.addEventListener("input", mainInputHandler);
}

//INPUT listeners
// const articleHowMany = document.getElementById("article-how-many");
// if (articleHowMany) {
//   console.log("AHHHHHHHHHH");
//   articleHowMany.addEventListener("input", mainInputHandler);
// }
// const picHowMany = document.getElementById("pic-how-many");
// const vidHowMany = document.getElementById("vid-how-many");
