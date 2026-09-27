import dbModel from "../../models/db-model.js";
import { buildWatchVidDto } from "../watch/watch-vids.js";

export const getNewVids = async (inputParams) => {
  if (!inputParams) return null;
  const { orderBy } = inputParams;

  const vidParams = buildVidParams(inputParams);
  if (!vidParams) return null;

  if (!hasWatchMediaPath()) return null;

  // Only get KCNA Watch videos for now.
  const vidDocs = await lookupWatchVids(vidParams, orderBy);
  if (!vidDocs) return null;

  return buildVidDtos(vidDocs);
};

//---

const hasWatchMediaPath = () => {
  if (process.env.EXPRESS_WATCH_PATH) return true;
  console.error("WATCH VIDEO CONFIG ERROR: EXPRESS_WATCH_PATH is not set");
  return false;
};

//playable watch vids only, in the requested order
const lookupWatchVids = async (vidParams, orderBy) => {
  if (!vidParams || !orderBy) return null;

  try {
    const watchModel = new dbModel(vidParams, "watch");
    switch (orderBy) {
      case "newest-to-oldest":
        return await watchModel.getNewestWatchVidsArray();
      case "oldest-to-newest":
        return await watchModel.getOldestWatchVidsArray();
      default:
        return null;
    }
  } catch (error) {
    console.error("WATCH VIDEO QUERY ERROR:", error.message);
    return null;
  }
};

const buildVidDtos = (vidDocs) => {
  const vidDtos = [];
  for (const vidDoc of vidDocs) {
    const vidDto = buildWatchVidDto(vidDoc);
    if (!vidDto) continue;
    vidDtos.push(vidDto);
  }
  return vidDtos;
};

//---

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

    case "watch":
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
