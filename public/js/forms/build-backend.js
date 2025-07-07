import d from "../util/define-things.js";
import { state } from "../util/state.js";
import { hideBackendReturnData } from "./form-change.js";

//get display element
const displayElement = document.getElementById("display-element");

export const buildBackendDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;
  const { isFirstLoad } = state;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //only need for loop on first load (could break this part out)
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
        if (defaultDataElement.id !== "article-display-container") {
          defaultDataElement.classList.add("hidden");
        }
        backendDataWrapper.append(defaultDataElement);
      }
      return backendDataWrapper;

    case false:
      const dataObj = inputArray[0];
      const { dataType, dataArray } = dataObj;

      // console.log("!!!DATA OBJ");
      // console.dir(dataObj);

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

      //hide backend return data if NOT article type change
      await hideBackendReturnData(newDataElement, dataType);

      // console.log("!!!NEW DATA ELEMENT");
      // console.log(newDataElement);

      backendDataWrapperReplace.replaceChild(newDataElement, replaceElement);
      return backendDataWrapperReplace;
  }
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
