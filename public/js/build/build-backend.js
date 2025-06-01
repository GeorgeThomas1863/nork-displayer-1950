import { sendToBack, checkBackendData, buildFailElement } from "../util.js";
import d from "../define-things.js";

//BUILDS DEFAULT DISPLAY
export const buildBackendDislay = async () => {
  //get backend data
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });
  const failElement = await buildFailElement();

  //returns fail element on data fail
  const backendDataCheck = await checkBackendData(backendDataObj);
  if (!backendDataCheck) return failElement;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //build each data element
  for (let i = 0; i < d.backendTypeArr.length; i++) {
    const dataType = d.backendTypeArr[i];
    const func = d.backendFunctionMap[dataType];
    const dataElement = await func(backendDataObj);
    backendDataWrapper.append(dataElement);
  }

  //could make more complex
  if (!backendDataWrapper) return failElement;

  return backendDataWrapper;
};
