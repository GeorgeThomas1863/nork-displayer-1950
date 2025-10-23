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

  const sortArray = await sortDataReturn(dataArray, typeTrigger);

  console.log(`${sortArray?.length} NEW ${typeTrigger} ITEMS`);
  return sortArray;
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

export const sortDataReturn = async (inputArray, itemType = "articles") => {
  if (!inputArray || !inputArray.length) return null;

  const prefix = itemType.slice(0, -1);
  const typeKey = `${prefix}Id`;

  // Create a copy of the array to avoid modifying the original
  const sortArray = [...inputArray];

  //sort input array by DATE OLDEST to NEWEST
  sortArray.sort((a, b) => {
    // Convert datetime strings to Date objects if needed
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    const dateCompare = dateB - dateA;

    if (dateCompare === 0) return b[typeKey] - a[typeKey];

    return dateCompare;
  });

  return sortArray;
};
