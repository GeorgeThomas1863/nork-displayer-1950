import { expandBackendData } from "./main.js";
import { buildAdminParams, sendToBack, debounce } from "./util.js";
import { getNewArticleData } from "./build/build-articles.js";
import { getNewPicData } from "./build/build-pics.js";
import { getNewVidData } from "./build/build-vids.js";

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

//---------------------------------

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const expandType = clickElement.getAttribute("data-expand");

  //handle expand / collapse backend data
  if (expandType) {
    await expandBackendData(expandType);
  }

  switch (clickId) {
    case "article-type":
    case "article-sort-by":
      await getNewArticleData();
      break;

    case "pic-type":
    case "pic-sort-by":
      await getNewPicData();
      break;

    case "vid-type":
    case "vid-sort-by":
      await getNewVidData();
      break;
  }

  return true;
};

//create debounced function
const debouncedGetNewArticleData = debounce(getNewArticleData);
const debouncedGetNewPicData = debounce(getNewPicData);
const debouncedGetNewVidData = debounce(getNewVidData);

export const mainInputHandler = async (e) => {
  const inputElement = e.target;

  const inputId = inputElement.id;

  switch (inputId) {
    case "article-how-many":
      debouncedGetNewArticleData();
      break;

    case "pic-how-many":
      debouncedGetNewPicData();
      break;

    case "vid-how-many":
      debouncedGetNewVidData();
      break;
  }

  return true;
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
