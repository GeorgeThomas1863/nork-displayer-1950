// import dbModel from "../../models/db-model.js";
import { dataLookup } from "../main-back.js";

export const getNewVids = async (inputParams) => {
  if (!inputParams) return null;
  const { orderBy } = inputParams;

  const vidParams = buildVidParams(inputParams);
  if (!vidParams) return null;

  //ONLY get vidPages for now
  return await dataLookup(vidParams, "vidPages", orderBy, false);
};

export const buildVidParams = (inputParams) => {
  if (!inputParams) return null;
  const { howMany, vidType } = inputParams;

  let params = null;
  switch (vidType) {
    case "all":
      params = {
        sortKey: "date",
        sortKey2: "vidId",
        howMany: Math.min(+(howMany) || +process.env.DEFAULT_LOAD_VIDS, 100),
      };
      break;

    case "vidPages":
      params = {
        sortKey: "date",
        sortKey2: "vidPageId",
        howMany: Math.min(+(howMany) || +process.env.DEFAULT_LOAD_VIDPAGES, 100),
      };
      break;

    default:
      return null;
  }

  return params;
};
