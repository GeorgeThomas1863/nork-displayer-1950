import d from "./define-things.js";
import { buildInputParams, buildAdminParams } from "./util.js";

export const state = {
  route: "/get-backend-data-route",
  isFirstLoad: true,
  dataType: "articles",
  articleType: "fatboy",

  //data already requested
  trigger: null,
  dataReq: d.defaultInputMap,
  dataLoaded: d.defaultDataLoadedMap,
};

export const updateStateEventTriggered = async (changeId, eventTriggered) => {
  //get data to update
  const inputParams = await buildInputParams();
  const newType = d.triggerTypeMap(changeId);
  const newArticleType = document.getElementById("article-type").value;

  //update state obj
  state.trigger = eventTriggered;
  state.dataReq = inputParams;
  state.dataType = newType;
  state.articleType = newArticleType;
};

//FUCKED, FIGURE OUT BELOW

//MAKE MUCH MORE COMPLEX
export const updateStateDataLoaded = async (inputArray) => {
  for (let i = 0; i < inputArray.length; i++) {
    const inputItem = inputArray[i];
    const { dataType, dataArray } = inputItem;
    const { dataLoaded } = state;

    //UPDATE JUST THE INDIVIDUAL ITEM
    for (let k in dataLoaded) {
      if (!dataType || dataType !== k) continue;

      const numberLoaded = dataArray?.length || 0;
      state.dataLoaded[k] = numberLoaded;
    }
  }

  state.isFirstLoad = false;

  return true;
};

//-----------------------------------------

export const adminState = {
  route: "/get-admin-default-data-route",
  isFirstLoad: true,
  dataType: "articles",
  articleType: "fatboy",

  scrapeId: null,

  //data already requested
  trigger: null,
  dataReq: d.defaultInputMap,
  dataLoaded: d.defaultDataLoadedMap,
};

export const updateAdminStateEventTriggered = async (inputType) => {
  if (!inputType) return null;

  //get input data
  const adminInputParams = await buildAdminParams();

  //update state obj
  adminState.dataReq = adminInputParams;
  adminState.trigger = "admin-submit";

  return true;
};

//BUILD, just return true for now
export const updateAdminStateDataLoaded = async (inputArray) => {
  adminState.isFirstLoad = false;

  return true;
};
