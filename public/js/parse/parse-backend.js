import { sendToBack } from "../util.js";
import { buildArticleData } from "./parse-articles.js";
import { buildPicSetData } from "./parse-pics.js";
import { buildVidPageData } from "./parse-vids.js";

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
  const { articleData, picSetData, vidPageData } = inputData;

  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  const articleDataWrapper = await buildArticleData(articleData);
  const picSetDataWrapper = await buildPicSetData(picSetData);
  const vidPageDataWrapper = await buildVidPageData(vidPageData);

  backendDataWrapper.append(articleDataWrapper, picSetDataWrapper, vidPageDataWrapper);

  return backendDataWrapper;
};
