import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

export const runUpdateData = async (inputParams) => {
  if (!inputParams) return null;
  const { trigger, isFirstLoad } = inputParams;

  if (isFirstLoad) {
    return await runFirstLoad(inputParams);
  }

  const newDataNeeded = await checkNewDataNeeded(inputParams);
  if (!newDataNeeded) return null;
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

  const dataModel = new dbModel(params, "articleList");
  const dataArray = await dataModel.getNewestItemsByTypeArray();

  console.log("DATA ARRAY");
  console.dir(dataArray);

  return dataArray;
};

export const checkNewDataNeeded = async (inputParams) => {};
