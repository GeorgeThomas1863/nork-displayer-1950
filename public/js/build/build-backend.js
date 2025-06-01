import { sendToBack } from "../util.js";
import d from "../define-things.js";
// import { buildArticlesDisplay } from "./build-articles.js";
// import { buildPicsDisplay, buildPicSetsDisplay } from "./build-pics.js";
// import { buildVidsDisplay, buildVidPagesDisplay } from "./build-vids.js";

//BUILDS DEFAULT DISPLAY
export const buildBackendDislay = async () => {
  //get backend data
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });

  //returns fail element on data fail
  const backendDataCheck = await checkBackendData(backendDataObj);
  if (backendDataCheck) return backendDataCheck;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //build each data element
  for (let i = 0; i < d.backendTypeArr.length; i++) {
    const dataType = d.backendTypeArr[i];
    const func = d.backendFunctionMap[dataType];

    console.log("FUNCTION!!!");
    console.log(func);

    const dataElement = await func(backendDataObj);
    backendDataWrapper.append(dataElement);
  }

  // const { articles, pics, picSets, vids, vidPages } = backendDataObj;
  // const articleDataWrapper = await buildArticleData(articleArray);
  // const picDataWrapper = await buildPicData(picArray);
  // const vidDataWrapper = await buildVidData(vidArray);

  // backendDataWrapper.append(articleDataWrapper, picDataWrapper, vidDataWrapper);

  return backendDataWrapper;
};

export const checkBackendData = async (inputObj) => {
  //define fail element
  const failElement = document.createElement("h1");
  failElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
  failElement.id = "backend-data-fail";

  if (!inputObj) return failElement;

  for (let i = 0; i < backendTypeArr.length; i++) {
    const dataType = backendTypeArr[i];
    if (!inputObj[dataType]) return failElement;
  }

  return null;
};
