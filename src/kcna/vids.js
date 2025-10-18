import CONFIG from "../../config/config.js";
import dbModel from "../../models/db-model.js";

export const getNewVids = async (inputParams) => {
  if (!inputParams) return null;
  const { vidType } = inputParams;

  const vidParams = await buildVidParams(inputParams);
  if (!vidParams) return null;

  let dataArray = null;
  let dataModel = null;
  switch (vidType) {
    case "all":
      dataModel = new dbModel(vidParams, "vids");
      dataArray = await dataModel.getNewestItemsArray();
      break;

    case "vidPages":
      dataModel = new dbModel(vidParams, "vidPages");
      dataArray = await dataModel.getNewestItemsArray();
      break;
    default:
      return null;
  }

  return dataArray;
};

export const buildVidParams = async (inputParams) => {
  if (!inputParams) return null;
  const { howMany, vidType } = inputParams;
  const { defaultDataLoad } = CONFIG;

  let params = null;
  switch (vidType) {
    case "all":
      params = {
        sortKey: "date",
        sortKey2: "vidId",
        howMany: howMany || defaultDataLoad.vids,
      };
      break;

    case "vidPages":
      params = {
        sortKey: "date",
        sortKey2: "vidPageId",
        howMany: howMany || defaultDataLoad.vidPages,
      };
      break;

    default:
      return null;
  }

  return params;
};
