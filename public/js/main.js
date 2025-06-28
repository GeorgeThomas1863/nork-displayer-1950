import d from "./define-things.js";
import { buildDropDown } from "./build-drop-down.js";
import { buildInputForms } from "./build-forms.js";
import { hideArray, unhideArray, sendToBack } from "./util.js";
import { state, updateStateDataLoaded } from "./state.js";
import { checkNewDataNeeded, checkHideUnhideData } from "./check-data.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
export const buildDisplay = async () => {
  if (!displayElement) return null;
  const { isFirstLoad } = state;

  //build drop down / form on first load
  if (isFirstLoad) {
    const dropDownElement = await buildDropDown();
    const inputFormWrapper = await buildInputForms();
    displayElement.append(dropDownElement, inputFormWrapper);
  }

  //check if new data is needed [will pass on first load]
  const newDataNeeded = await checkNewDataNeeded();
  if (!newDataNeeded) {
    //if new data not needed, check if hide / unhide data
    await checkHideUnhideData();
    return null;
  }

  //get / parse backend data (returns array of objects)
  const backendData = await sendToBack(state);
  if (!backendData) return null;

  const backendDataParsed = await buildBackendDisplay(backendData);

  //on fail
  if (!backendDataParsed) {
    await displayFail();
    return null;
  }

  //otherwise append data
  displayElement.append(backendDataParsed);

  //UPDATE THE STATE HERE
  await updateStateDataLoaded(backendData);

  console.log("!!!DISPLAY ELEMENT");
  console.log(displayElement);

  return "#DONE";
};

export const buildBackendDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;
  const { isFirstLoad } = state;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //only need for loop on first load (could break this part out)
  //
  switch (isFirstLoad) {
    case true:
      //loop through each data type
      for (let i = 0; i < inputArray.length; i++) {
        const dataObj = inputArray[i];
        const { dataType, dataArray } = dataObj;
        const func = d.displayFunctionMap[dataType];
        const defaultDataElement = await func(dataArray);
        if (!defaultDataElement) continue;
        //hide everything except pics on default
        if (defaultDataElement.id !== "article-array-element") {
          defaultDataElement.classList.add("hidden");
        }
        backendDataWrapper.append(defaultDataElement);
      }
      return backendDataWrapper;

    case false:
      const dataObj = inputArray[0];
      const { dataType, dataArray } = dataObj;

      //get replace shit first
      const replaceId = d.replaceTypeMap[dataType];
      const replaceElement = document.getElementById(replaceId);
      const backendDataWrapperReplace = document.getElementById("backend-data-wrapper");

      //format data
      const func = d.displayFunctionMap[dataType];
      const newDataElement = await func(dataArray);
      if (!newDataElement) {
        return null;
      }

      //HIDE FIRST COLLAPSE
      const prefix = dataType.substring(0, dataType.length - 1);
      const listArray = newDataElement.querySelectorAll(`.${prefix}-list-item`);
      const content = listArray[0].querySelector(".collapse-content");
      content.classList.add("hidden");

      backendDataWrapperReplace.replaceChild(newDataElement, replaceElement);
      return backendDataWrapperReplace;
  }
};

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

export const displayFail = async () => {
  const failElement = document.createElement("h1");
  failElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
  failElement.id = "backend-data-fail";

  const backendDataWrapperReplace = document.getElementById("backend-data-wrapper");
  if (!backendDataWrapperReplace) {
    displayElement.append(failElement);
  } else {
    displayElement.replaceChild(failElement, backendDataWrapperReplace);
  }

  return true;
};

buildDisplay();
