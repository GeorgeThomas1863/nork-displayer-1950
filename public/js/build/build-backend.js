import { sendToBack } from "../util.js";
import { buildArticleData } from "./build-articles.js";
import { buildPicData } from "./build-pics.js";
import { buildVidData } from "./build-vids.js";

//BUILDS DEFAULT DISPLAY
export const buildBackendDislay = async () => {
  //get backend data
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });

  //BELOW DOES NOT WORK
  if (!backendDataObj || !backendDataObj.articleArray || !backendDataObj.picArray || !backendDataObj.vidArray) {
    const failElement = document.createElement("h1");
    failElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
    failElement.id = "backend-data-fail";
    console.log(failElement);
    return failElement;
  }

  const { articleArray, picArray, vidArray } = backendDataObj;

  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  const articleDataWrapper = await buildArticleData(articleArray);
  const picDataWrapper = await buildPicData(picArray);
  const vidDataWrapper = await buildVidData(vidArray);

  backendDataWrapper.append(articleDataWrapper, picDataWrapper, vidDataWrapper);

  return backendDataWrapper;
};
