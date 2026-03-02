import CONFIG from "../../middleware/config.js";
// import dbModel from "../../models/db-model.js";
import { dataLookup } from "../main-back.js";

export const getNewArticles = async (inputParams) => {
  if (!inputParams) return null;
  const { articleType, orderBy } = inputParams;

  const articleParams = buildArticleParams(inputParams);
  if (!articleParams) return null;

  if (articleType === "all") return await dataLookup(articleParams, "articles", orderBy, false);

  return await dataLookup(articleParams, "articles", orderBy, true);
};

export const buildArticleParams = (inputParams) => {
  if (!inputParams) return null;
  const { articleType, howMany } = inputParams;
  const { defaultDataLoad } = CONFIG;

  if (articleType === "all") {
    const allParams = {
      sortKey: "date",
      sortKey2: "articleId",
      howMany: Math.min(+(howMany) || defaultDataLoad.articles, 100),
    };
    return allParams;
  }

  const articleParams = {
    filterKey: "articleType",
    filterValue: articleType,
    howMany: Math.min(+(howMany) || defaultDataLoad.articles, 100),
    sortKey: "date",
  };

  return articleParams;
};
