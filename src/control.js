import { getNewArticles } from "./kcna/articles.js";
import { getNewPics } from "./kcna/pics.js";
import { getNewVids } from "./kcna/vids.js";
import dbModel from "../models/db-model.js";

export const runUpdateData = async (inputParams) => {
  if (!inputParams) return null;
  const { typeTrigger } = inputParams;

  // const newDataNeeded = await checkNewDataNeeded(inputParams);
  // if (!newDataNeeded) return null;

  console.log("RUN UPDATE PARAMS");
  console.log(inputParams);

  let dataArray = null;
  switch (typeTrigger) {
    case "articles":
      dataArray = await getNewArticles(inputParams);
      break;
    case "pics":
      dataArray = await getNewPics(inputParams);
      break;
    case "vids":
      dataArray = await getNewVids(inputParams);
      break;
    default:
      return null;
  }

  console.log(`${dataArray?.length} NEW ${typeTrigger} ITEMS`);
  return dataArray;
};

export const dataLookup = async (params, collection, orderBy, typeIncluded = false) => {
  if (!params || !collection || !orderBy) return null;

  const dataModel = new dbModel(params, collection);

  let dataArray = null;
  switch (typeIncluded) {
    case true:
      switch (orderBy) {
        case "newest-to-oldest":
          dataArray = await dataModel.getNewestItemsByTypeArray();
          break;
        case "oldest-to-newest":
          dataArray = await dataModel.getOldestItemsByTypeArray();
          break;
        default:
          return null;
      }
      break;

    case false:
      switch (orderBy) {
        case "newest-to-oldest":
          dataArray = await dataModel.getNewestItemsArray();
          break;
        case "oldest-to-newest":
          dataArray = await dataModel.getOldestItemsArray();
          break;
        default:
          return null;
      }
      break;

    default:
      return null;
  }

  return dataArray;
};
