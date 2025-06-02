import { expandBackendData, getNewData } from "./main.js";
import { buildAdminParams, sendToBack, debounce } from "./util.js";
import { buildBackendNew } from "./build-backend.js";
// import { getNewArticleData } from "./articles/article-data.js";
// import { getNewPicData } from "./pics/pic-data.js";
// import { getNewVidData } from "./vids/vid-data.js";

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

//MAKE A GET NEW DATA FUNCTION AND PARSE TYPE THERE

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const expandType = clickElement.getAttribute("data-expand");

  //handle expand / collapse backend data
  if (expandType) {
    await expandBackendData(expandType);
  }

  const clickObj = {
    clickId: clickId,
    expandType: expandType,
  };

  const newBackendData = await getNewData(clickObj);
  if (!newBackendData) return null;

  await buildBackendNew(newBackendData);

  return true;
};

//create debounced function
// const debouncedGetNewArticleData = debounce(getNewArticleData);
// const debouncedGetNewPicData = debounce(getNewPicData);
// const debouncedGetNewVidData = debounce(getNewVidData);

export const mainInputHandler = async (e) => {
  const inputElement = e.target;

  const inputId = inputElement.id;

  // switch (inputId) {
  //   case "article-how-many":
  //     debouncedGetNewArticleData();
  //     break;

  //   case "pic-how-many":
  //     debouncedGetNewPicData();
  //     break;

  //   case "vid-how-many":
  //     debouncedGetNewVidData();
  //     break;
  // }

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
