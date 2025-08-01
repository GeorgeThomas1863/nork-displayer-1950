import d from "../util/define-things.js";
import { state } from "../util/state.js";
import { hideArray, unhideArray } from "../util/util.js";

//better version of expand backend data equation
export const expandForm = async (dataType) => {
  const { expandIdsArr } = d;

  //build array of expand form elements (defining id's in define-things.js)
  const expandElementsArr = [];
  for (let i = 0; i < expandIdsArr.length; i++) {
    expandElementsArr.push(document.getElementById(expandIdsArr[i]));
  }

  //hide everything
  await hideArray(expandElementsArr);

  //unhide the one  being expanded
  switch (dataType) {
    case "article-form-header":
      await unhideArray([expandElementsArr[0]]);
      return true;

    case "pic-form-header":
      await unhideArray([expandElementsArr[1]]);
      return true;

    case "vid-form-header":
      await unhideArray([expandElementsArr[2]]);
      return true;
  }
  return null;
};

export const toggleDropdown = async (toggleType) => {
  if (!toggleType || toggleType !== "dropdown") return null;

  const actionButtonElement = document.getElementById("action-button-element");
  if (!actionButtonElement) return null;

  const isHidden = actionButtonElement.classList.contains("hidden");

  isHidden ? await unhideArray([actionButtonElement]) : await hideArray([actionButtonElement]);

  return true;
};

//HIDES FIRST COLLAPSE IF NOT ARTICLE TYPE CHANGE
export const hideBackendReturnData = async (inputElement, dataType) => {
  const { trigger } = state;

  //dont hide if showing diff article type
  if (trigger === "article-type") return null;

  const prefix = dataType.substring(0, dataType.length - 1);
  const listArray = inputElement.querySelectorAll(`.${prefix}-list-item`);
  const content = listArray[0].querySelector(".collapse-content");
  content.classList.add("hidden");

  return true;
};
