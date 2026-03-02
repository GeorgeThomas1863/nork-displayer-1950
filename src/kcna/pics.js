import CONFIG from "../../middleware/config.js";
import { dataLookup } from "../main-back.js";
// import dbModel from "../../models/db-model.js";

export const getNewPics = async (inputParams) => {
  if (!inputParams) return null;
  const { orderBy, picType } = inputParams;

  const picParams = buildPicParams(inputParams);
  if (!picParams) return null;

  if (picType === "all") return await dataLookup(picParams, "pics", orderBy, false);

  return await dataLookup(picParams, "picSets", orderBy, false);
};

export const buildPicParams = (inputParams) => {
  if (!inputParams) return null;
  const { howMany, picType } = inputParams;
  const { defaultDataLoad } = CONFIG;

  let params = null;
  switch (picType) {
    case "all":
      params = {
        sortKey: "date",
        sortKey2: "picId",
        howMany: Math.min(+(howMany) || defaultDataLoad.pics, 100),
      };
      break;

    case "picSets":
      params = {
        sortKey: "date",
        sortKey2: "picSetId",
        howMany: Math.min(+(howMany) || defaultDataLoad.picSets, 100),
      };
      break;

    default:
      return null;
  }

  return params;
};
