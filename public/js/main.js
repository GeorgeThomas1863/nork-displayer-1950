import d from "./define-things.js";
import { buildDropDown } from "./build-drop-down.js";
import { buildInputForms } from "./build-forms.js";
import { hideArray, unhideArray, sendToBack, buildFailElement } from "./util.js";
import { state, updateDataLoaded, checkNewDataNeeded } from "./state.js";

//get display element
const displayElement = document.getElementById("display-element");
const failElement = await buildFailElement();

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
  // console.log("NEW DATA NEEDED");
  // console.log(newDataNeeded);

  if (!newDataNeeded) return null;

  //get / parse backend data (returns array of objects)
  const backendData = await sendToBack(state);
  if (!backendData) return null;

  console.log("BACKEND DATA");
  console.dir(backendData);

  const backendDataParsed = await buildBackendDisplay(backendData);

  // console.log("!!!!BACKEND DATA PARSED");
  // console.dir(backendDataParsed);

  if (!backendDataParsed) return null;
  // console.log("!!!!BACKEND DATA PARSED");
  // console.log(backendDataParsed);

  displayElement.append(backendDataParsed);

  //UPDATE THE STATE HERE
  await updateDataLoaded(backendData);

  // console.log("STATE");
  // console.log(state);

  console.log("DISPLAY ELEMENT");
  console.dir(displayElement);

  return "#DONE";
};

export const buildBackendDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return failElement;
  const { isFirstLoad } = state;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //only need for loop on first load (could break this part out)
  //
  if (isFirstLoad) {
    for (let i = 0; i < inputArray.length; i++) {
      const dataObj = inputArray[i];
      const { dataType, dataArray } = dataObj;
      const func = d.displayFunctionMap[dataType];
      const dataElement = await func(dataArray);
      if (!dataElement) continue;
      //hide everything except pics on default
      if (dataElement.id !== "article-array-element") {
        dataElement.classList.add("hidden");
      }
      backendDataWrapper.append(dataElement);
    }
  } else {
    const dataObj = inputArray[0];
    const { dataType, dataArray } = dataObj;

    //get replace shit first
    // const currentBackendDataWrapper = document.getElementById("backend-data-wrapper");
    const replaceId = d.replaceTypeMap[dataType];
    const replaceElement = document.getElementById(replaceId);
    const backendDataWrapper = document.getElementById("backend-data-wrapper");

    //format data
    const func = d.displayFunctionMap[dataType];
    const dataElement = await func(dataArray);
    if (!dataElement) return failElement;

    // console.log("DATA ELEMENT");
    // console.log(dataElement);

    // console.log("REPLACE ELEMENT");
    // console.log(replaceElement);

    // console.log("BACKEND DATA WRAPPER BEFORE ");
    // console.log(backendDataWrapper);

    backendDataWrapper.replaceChild(dataElement, replaceElement);

    // console.log("BACKEND DATA WRAPPER AFTER");
    // console.log(backendDataWrapper);

    //replace element

    // return backendDataWrapper;

    // return true;
  }

  if (!backendDataWrapper) return failElement;

  return backendDataWrapper;
};

//better version of expand backend data equation
export const expandForm = async (dataType) => {
  const { expandIdsArr } = d;
  // console.log("EXPAND BACKEND DATA");
  // console.log(dataType);

  const picType = document.getElementById("pic-type").value;
  const vidType = document.getElementById("vid-type").value;

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
      if (picType === "pic-alone") {
        await unhideArray([expandElementsArr[1]]);
      } else if (picType === "pic-sets") {
        await unhideArray([expandElementsArr[2]]);
      } else {
        return null;
      }

      return true;

    case "vid-form-header":
      if (vidType === "vid-alone") {
        await unhideArray([expandElementsArr[3]]);
      } else if (vidType === "vid-pages") {
        await unhideArray([expandElementsArr[4]]);
      } else {
        return null;
      }

      return true;
  }
};

export const toggleDropdown = async (toggleType) => {
  if (!toggleType || toggleType !== "dropdown") return null;

  const actionButtonElement = document.getElementById("action-button-element");
  if (!actionButtonElement) return null;

  const isHidden = actionButtonElement.classList.contains("hidden");

  isHidden ? await unhideArray([actionButtonElement]) : await hideArray([actionButtonElement]);

  return true;
};

buildDisplay();
