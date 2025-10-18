import CONFIG from "../config/config.js";
import dbModel from "../models/db-model.js";

export const runUpdateData = async (inputParams) => {
  if (!inputParams) return null;
  const { trigger, typeTrigger } = inputParams;

  const newDataNeeded = await checkNewDataNeeded(inputParams);
  if (!newDataNeeded) return null;

  console.log("RUN UPDATE DATA");
  console.log(inputParams);

  let dataArray = null;
  if (typeTrigger === "articles") {
    dataArray = await getNewArticles(inputParams);
  }

  console.log("DATA ARRAY");
  console.dir(dataArray.length);
  return dataArray;
};

//BUILD
export const checkNewDataNeeded = async (inputParams) => {
  const { isFirstLoad } = inputParams;

  if (isFirstLoad) return true;

  //BUILD
  return true;
};

export const getNewArticles = async (inputParams) => {
  if (!inputParams) return null;
  const { articleType } = inputParams;

  const articleParams = await buildArticleParams(inputParams);
  if (!articleParams) return null;

  const dataModel = new dbModel(articleParams, "articles");

  let dataArray = null;
  if (articleType === "all") {
    dataArray = await dataModel.getNewestItemsArray();
    return dataArray;
  }

  dataArray = await dataModel.getNewestItemsByTypeArray();
  return dataArray;
};

export const buildArticleParams = async (inputParams) => {
  if (!inputParams) return null;
  const { articleType, howMany } = inputParams;
  const { defaultDataLoad } = CONFIG;

  if (articleType === "all") {
    const allParams = {
      sortKey: "date",
      sortKey2: "articleId",
      howMany: howMany || defaultDataLoad.articles,
    };
    return allParams;
  }

  const articleParams = {
    filterKey: "articleType",
    filterValue: articleType,
    howMany: howMany || defaultDataLoad.articles,
    sortKey: "date",
  };

  return articleParams;
};
