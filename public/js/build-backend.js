import { sendToBack, buildFailElement } from "./util.js";
import d from "./define-things.js";

//BUILDS DEFAULT DISPLAY
export const buildBackendDislay = async (inputObj) => {
  if (!inputObj) return null;
  const { dataType } = inputObj;

  //get fail element
  const failElement = await buildFailElement();

  //set backend params
  const paramsObj = { ...inputObj };
  paramsObj.route = "/get-backend-data-route";

  console.log("!!!!!!!!paramsObj");
  console.log(paramsObj);

  //get backend data
  const backendDataObj = await sendToBack(paramsObj);
  if (!backendDataObj) return failElement;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //parse backend data
  const func = d.backendFunctionMap[dataType];
  const dataElement = await func(backendDataObj[dataType]);
  backendDataWrapper.append(dataElement);

  if (!backendDataWrapper) return failElement;

  return backendDataWrapper;

  // //returns fail element on data fail
  // const backendDataCheck = await checkBackendData(backendDataObj);
  // if (!backendDataCheck) return failElement;

  // //build each data element
  // for (let i = 0; i < d.backendTypeArr.length; i++) {
  //   const dataType = d.backendTypeArr[i];
  //   const func = d.backendFunctionMap[dataType];
  //   const dataElement = await func(backendDataObj[dataType]);
  //   console.log("AHHHHHHHHHH");
  //   console.log(dataType);
  //   console.log(dataElement);
  //   backendDataWrapper.append(dataElement);
  // }

  // //could make more complex
  // if (!backendDataWrapper) return failElement;

  // return backendDataWrapper;
};
