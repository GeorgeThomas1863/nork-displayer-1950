import { sendToBack } from "../util.js";
import { buildArticleData } from "./build-articles.js";
import { buildPicData } from "./build-pics.js";
import { buildVidData } from "./build-vids.js";

//BUILDS DEFAULT DISPLAY
export const buildBackendDislay = async () => {
  //get backend data
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });

  //returns fail element on data fail
  const backendDataCheck = await checkBackendData(backendDataObj);
  if (backendDataCheck) return backendDataCheck;

  const { articleArray, picArray, vidArray } = backendDataObj;

  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  const articleDataWrapper = await buildArticleData(articleArray);
  const picDataWrapper = await buildPicData(picArray);
  const vidDataWrapper = await buildVidData(vidArray);

  backendDataWrapper.append(articleDataWrapper, picDataWrapper, vidDataWrapper);

  return backendDataWrapper;
};

export const checkBackendData = async (backendDataObj) => {
  //define fail element
  const failElement = document.createElement("h1");
  failElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
  failElement.id = "backend-data-fail";

  if (!backendDataObj) return failElement;

  // const dataTypeArr = ["articles", "pics", "picSets", "vids", "vidPages"];
  const dataTypeArr = ["articles", "pics", "picSets", "vids", "balls"];

  for (let i = 0; i < dataTypeArr.length; i++) {
    const dataType = dataTypeArr[i];
    if (!backendDataObj[dataType]) return failElement;
  }

  return null;
};
