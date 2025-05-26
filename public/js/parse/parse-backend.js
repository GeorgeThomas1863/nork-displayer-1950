import { sendToBack } from "../util.js";
import { buildArticleData } from "./parse-articles.js";
import { buildPicData } from "./parse-pics.js";
import { buildVidData } from "./parse-vids.js";

//GET BACKEND DATA
export const getBackendData = async () => {
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });

  //if ANY item missing return null [might want to CHANGE]
  if (!backendDataObj || !backendDataObj.articleData || !backendDataObj.picSetData || !backendDataObj.vidPageData) {
    const failElement = document.createElement("h1");
    failElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
    console.log(failElement);
    return failElement;
  }

  //otherwise return data
  return backendDataObj;
};

export const buildBackendDislay = async (inputData) => {
  if (!inputData) return null;
  const { articleArray, picArray, vidArray } = inputData;

  console.log("!!!BACKEND DATA", inputData);
  console.dir(inputData);

  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  const articleDataWrapper = await buildArticleData(articleArray);
  const picDataWrapper = await buildPicData(picArray);
  const vidDataWrapper = await buildVidData(vidArray);

  backendDataWrapper.append(articleDataWrapper, picDataWrapper, vidDataWrapper);

  return backendDataWrapper;
};
