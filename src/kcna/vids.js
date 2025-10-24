import CONFIG from "../../config/config.js";
// import dbModel from "../../models/db-model.js";
import { dataLookup } from "../run-main.js";

export const getNewVids = async (inputParams) => {
  if (!inputParams) return null;
  const { orderBy } = inputParams;

  const vidParams = await buildVidParams(inputParams);
  if (!vidParams) return null;

  //ONLY get vidPages for now
  return await dataLookup(vidParams, "vidPages", orderBy, false);
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
