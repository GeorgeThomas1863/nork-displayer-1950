import d from "./define-things.js";
import { sendToBack, buildFailElement } from "./util.js";
import { buildAdminDefaultDisplay, buildAdminNewDisplay } from "./admin/admin-return.js";

//get default elements
const displayElement = document.getElementById("display-element");
const adminDisplayElement = document.getElementById("admin-display-element");
const failElement = await buildFailElement();

//BUILDS DEFAULT DISPLAY
export const buildBackendDefault = async (inputObj) => {
  if (!inputObj) return null;
  const { dataType } = inputObj;

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
  const func = d.displayFunctionMap[dataType];
  const dataElement = await func(backendDataObj[dataType]);
  backendDataWrapper.append(dataElement);

  if (!backendDataWrapper) return failElement;

  return backendDataWrapper;
};

//ADD IN MAP HERE FROM d to parse data
export const buildBackendNew = async (inputObj) => {
  if (!inputObj || !inputObj.dataType) return null;

  const { dataType } = inputObj;
  const newDataArray = inputObj[dataType];

  const func = d.displayFunctionMap[dataType];
  const newDataElement = await func(newDataArray);

  const backendDataWrapper = document.getElementById("backend-data-wrapper");

  backendDataWrapper.replaceChild(newDataElement, backendDataWrapper.firstElementChild);

  displayElement.append(backendDataWrapper);

  return true;
};

export const buildAdminBackendDefault = async (inputObj) => {
  //build current backend data
  const backendAdminData = await sendToBack(inputObj);
  if (!backendAdminData) return failElement;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "admin-backend-data-wrapper";

  //parse backend data
  const dataElement = await buildAdminDefaultDisplay(backendAdminData);
  if (!dataElement) return failElement;

  backendDataWrapper.append(dataElement);

  return backendDataWrapper;
};

export const buildAdminBackendNew = async (inputObj) => {
  //parse backend data
  const dataElement = await buildAdminNewDisplay(inputObj);
  if (!dataElement) return failElement;

  //replace old data with new data
  const backendDataWrapper = document.getElementById("admin-backend-data-wrapper");
  backendDataWrapper.replaceChild(dataElement, backendDataWrapper.firstElementChild);

  // adminDisplayElement.append(dataElement);

  return true;
};
