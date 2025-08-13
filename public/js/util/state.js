import d from "./define-things.js";
import { buildInputParams, buildAdminParams } from "./params.js";
import { updateActiveArticle } from "../articles/article-change.js";

export const state = {
  route: "/get-backend-data-route",
  isFirstLoad: true,
  dataType: "articles",
  articleType: "fatboy",

  //data already requested
  trigger: null,
  dataReq: d.defaultInputMap,
  dataLoaded: d.defaultDataLoadedMap,
  currentChunkIndex: -1,
  globalCurrentTime: 0,
  isUserSeeking: false,
  animationFrameId: null,
};

export const updateStateEventTriggered = async (changeId, eventTriggered) => {
  //get data to update
  // console.log("CHANGE ID");
  // console.log(changeId);

  // console.log("EVENT TRIGGERED");
  // console.log(eventTriggered);

  const inputParams = await buildInputParams();
  const newType = d.triggerTypeMap(changeId);

  //update state obj
  state.trigger = eventTriggered;
  state.dataReq = inputParams;
  state.dataType = newType;

  //if change article type return
  if (eventTriggered !== "article-type") return true;

  //otherwise update article type (in dataReq too bc backend needs it [dumb design])
  state.articleType = changeId;
  state.dataReq.articleType = changeId;
  state.dataType = "articles";

  return true;
};

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

  //update active article (doing here instead of main)
  await updateActiveArticle(state);

  return true;
};

//-----------------------------------------

export const adminState = {
  route: "/get-admin-backend-data-route",
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
  adminState.trigger = null;

  return true;
};
