import CONFIG from "../../config/config.js";
import { dataLookup } from "../control.js";
// import dbModel from "../../models/db-model.js";

export const getNewPics = async (inputParams) => {
  if (!inputParams) return null;
  const { orderBy, picType } = inputParams;

  const picParams = await buildPicParams(inputParams);
  if (!picParams) return null;

  if (picType === "all") return await dataLookup(picParams, "pics", orderBy, false);

  return await dataLookup(picParams, "picSets", orderBy, false);
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
