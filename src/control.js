import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

export const runUpdateData = async (inputParams) => {
  if (!inputParams) return null;
  const { trigger, isFirstLoad } = inputParams;

  console.log("RUN UPDATE DATA");
  console.log(inputParams);

  if (isFirstLoad) {
    return await runFirstLoad(inputParams);
  }

  const newDataNeeded = await checkNewDataNeeded(inputParams);
  if (!newDataNeeded) return null;

  return await runUpdateLoad(inputParams);
};

export const runFirstLoad = async (inputParams) => {
  if (!inputParams) return null;
  const { articleType } = inputParams;
  const { defaultDataLoad } = CONFIG;

  console.log("RUN FIRST LOAD");
  console.log(inputParams);

  const params = {
    filterKey: "articleType",
    filterValue: articleType,
    howMany: defaultDataLoad.articles,
    sortKey: "date",
  };

  const dataModel = new dbModel(params, "articles");
  const dataArray = await dataModel.getNewestItemsByTypeArray();

  console.log("DATA ARRAY");
  console.dir(dataArray);

  return dataArray;
};

//BUILD
export const checkNewDataNeeded = async (inputParams) => {
  return true;
};

export const runUpdateLoad = async (inputParams) => {
  if (!inputParams) return null;
  const { typeTrigger, articleType, howMany } = inputParams;
  const { defaultDataLoad } = CONFIG;

  let params = {};
  if (typeTrigger === "articles") {
    params = {
      filterKey: "articleType",
      filterValue: articleType,
      howMany: howMany || defaultDataLoad.articles,
      sortKey: "date",
    };
  }

  console.log("UPDATE PARAMS");
  console.dir(params);

  const dataModel = new dbModel(params, typeTrigger);
  const dataArray = await dataModel.getNewestItemsByTypeArray();
  return dataArray;
};
