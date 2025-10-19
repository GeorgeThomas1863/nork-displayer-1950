import CONFIG from "../../config/config.js";
// import dbModel from "../../models/db-model.js";
import { dataLookup } from "../control.js";

export const getNewArticles = async (inputParams) => {
  if (!inputParams) return null;
  const { articleType, orderBy } = inputParams;

  const articleParams = await buildArticleParams(inputParams);
  if (!articleParams) return null;

  if (articleType === "all") return await dataLookup(articleParams, "articles", orderBy, false);

  return await dataLookup(articleParams, "articles", orderBy, true);
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
