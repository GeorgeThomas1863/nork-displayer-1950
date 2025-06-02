import d from "./define-things.js";
import { sendToBack, buildFailElement } from "./util.js";

//BUILDS DEFAULT DISPLAY
export const buildBackendDefault = async (inputObj) => {
  if (!inputObj) return null;
  const { dataType } = inputObj;

  //get fail element
  const failElement = await buildFailElement();

  //set backend params
  const paramsObj = { ...inputObj };
  paramsObj.route = "/get-backend-data-route";

  //get backend data
  const backendDataObj = await sendToBack(paramsObj);
  if (!backendDataObj) return failElement;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //parse backend data
  const func = d.defaultDataDisplayMap[dataType];
  const dataElement = await func(backendDataObj[dataType]);
  backendDataWrapper.append(dataElement);

  if (!backendDataWrapper) return failElement;

  return backendDataWrapper;
};

//UNFUCK HERE; USE MAP TO MAKE BELOW DYNAMIC
export const buildBackendNew = async (inputObj) => {
  if (!inputObj || !inputObj.dataType) return null;

  console.log("DISPLAY NEW DATA");
  console.log(inputObj);

  const { dataType } = inputObj;
  const newDataArray = inputObj[dataType];

  //FIGURE OUT WAY TO MAKE THIS DYNAMIC
  const articleReturnData = await buildArticleReturnDisplay(newDataArray);

  const backendDataWrapper = document.getElementById("backend-data-wrapper");

  displayElement.replaceChild(articleReturnData, backendDataWrapper);

  return true;
};
