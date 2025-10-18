import CONFIG from "../../config/config.js";
import dbModel from "../../models/db-model.js";

export const getNewPics = async (inputParams) => {
  if (!inputParams) return null;
  const { picType } = inputParams;

  const picParams = await buildPicParams(inputParams);
  if (!picParams) return null;

  let dataArray = null;
  let dataModel = null;
  switch (picType) {
    case "all":
      dataModel = new dbModel(picParams, "pics");
      dataArray = await dataModel.getNewestItemsArray();
      break;

    case "picSets":
      dataModel = new dbModel(picParams, "picSets");
      dataArray = await dataModel.getNewestItemsArray();
      break;
    default:
      return null;
  }

  return dataArray;
};

export const buildPicParams = async (inputParams) => {
  if (!inputParams) return null;
  const { howMany, picType } = inputParams;
  const { defaultDataLoad } = CONFIG;

  let params = null;
  switch (picType) {
    case "all":
      params = {
        sortKey: "date",
        sortKey2: "picId",
        howMany: howMany || defaultDataLoad.pics,
      };
      break;

    case "picSets":
      params = {
        sortKey: "date",
        sortKey2: "picSetId",
        howMany: howMany || defaultDataLoad.picSets,
      };
      break;

    default:
      return null;
  }

  return params;
};
