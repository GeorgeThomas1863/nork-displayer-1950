import { getBackendData, buildBackendDislay } from "./parse/parse-backend.js";
import { buildDropDown } from "./parse/parse-drop-down.js";
import { buildInputForms } from "./parse/parse-forms.js";
import { hideArray, unhideArray } from "./util.js";
import { defineCollapseItems } from "./collapse.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
export const buildDefaultDisplay = async () => {
  //get backend data FIRST (to check for fail )
  const backendDataObj = await getBackendData();
  if (!backendDataObj) return null;

  //build drop down
  const dropDownElement = await buildDropDown();

  //build input forms
  const inputFormWrapper = await buildInputForms();

  //build data return
  const backendDataWrapper = await buildBackendDislay(backendDataObj);

  displayElement.append(dropDownElement, inputFormWrapper, backendDataWrapper);

  return "#DONE";
};

//------------------------------------

//RESPONSIVE STUFF

export const expandBackendData = async (dataType) => {
  const articleArrow = document.querySelector("#collapse-arrow[data-expand='article-form-header']");
  const picArrow = document.querySelector("#collapse-arrow[data-expand='pic-form-header']");
  const vidArrow = document.querySelector("#collapse-arrow[data-expand='vid-form-header']");

  const isArticleExpanded = articleArrow.classList.contains("expanded");
  const isPicExpanded = picArrow.classList.contains("expanded");
  const isVidExpanded = vidArrow.classList.contains("expanded");

  //get form elements
  const articleWrapper = document.getElementById("article-wrapper");
  const picWrapper = document.getElementById("pic-wrapper");
  const vidWrapper = document.getElementById("vid-wrapper");

  //get backend data elements
  const articleArrayElement = document.getElementById("article-array-element");
  const picArrayElement = document.getElementById("pic-array-element");
  const vidArrayElement = document.getElementById("vid-array-element");

  switch (dataType) {
    case "article-form-header":
      if (isArticleExpanded) {
        await hideArray([picArrayElement, picWrapper, vidArrayElement, vidWrapper]);
        await unhideArray([articleArrayElement, articleWrapper]);

        picArrow.classList.remove("expanded");
        vidArrow.classList.remove("expanded");
      } else {
        await hideArray([articleArrayElement, articleWrapper]);
      }
      break;

    case "pic-form-header":
      if (isPicExpanded) {
        await hideArray([articleArrayElement, articleWrapper, vidArrayElement, vidWrapper]);
        await unhideArray([picArrayElement, picWrapper]);

        articleArrow.classList.remove("expanded");
        vidArrow.classList.remove("expanded");
      } else {
        await hideArray([picArrayElement, picWrapper]);
      }
      break;

    case "vid-form-header":
      if (isVidExpanded) {
        await hideArray([articleArrayElement, articleWrapper, picArrayElement, picWrapper]);
        await unhideArray([vidArrayElement, vidWrapper]);

        articleArrow.classList.remove("expanded");
        picArrow.classList.remove("expanded");
      } else {
        await hideArray([vidArrayElement, vidWrapper]);
      }
      break;

    default:
      console.log("INPUT FUCKED");
      return null;
  }

  return true;
};

buildDefaultDisplay();
