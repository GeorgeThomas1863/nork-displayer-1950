import { sendToBack } from "../util.js";
import { buildArticleData } from "./build-articles.js";
import { buildPicData } from "./build-pics.js";
import { buildVidData } from "./build-vids.js";

//GETS DEFAULT DATA
export const getBackendData = async () => {
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });

  //BELOW DOES NOT WORK
  if (!backendDataObj || !backendDataObj.articleArray || !backendDataObj.picArray || !backendDataObj.vidArray) {
    console.log("AHHHHHHHHHHHHHH")
    const failElement = document.createElement("h1");
    failElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
    console.log(failElement);
    return failElement;
  }

  //otherwise return data
  return backendDataObj;
};

//BUILDS DEFAULT DISPLAY
export const buildBackendDislay = async (inputData) => {
  if (!inputData) return null;
  const { articleArray, picArray, vidArray } = inputData;

  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  const articleDataWrapper = await buildArticleData(articleArray);
  const picDataWrapper = await buildPicData(picArray);
  const vidDataWrapper = await buildVidData(vidArray);

  backendDataWrapper.append(articleDataWrapper, picDataWrapper, vidDataWrapper);

  return backendDataWrapper;
};
