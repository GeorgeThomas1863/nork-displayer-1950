import dbModel from "../../models/db-model.js";

export const getWatchVids = async (howMany) => {
  if (!hasWatchMediaPath()) return null;
  const normalizedHowMany = normalizeHowMany(howMany);

  try {
    const watchModel = new dbModel({ howMany: normalizedHowMany }, "vidPages");
    const watchVids = await watchModel.getNewestWatchVidsArray();
    return buildWatchVidDtos(watchVids);
  } catch (error) {
    console.error("WATCH VIDEO QUERY ERROR:", error.message);
    return null;
  }
};

const hasWatchMediaPath = () => {
  if (process.env.EXPRESS_WATCH_PATH) return true;
  console.error("WATCH VIDEO CONFIG ERROR: EXPRESS_WATCH_PATH is not set");
  return false;
};

const normalizeHowMany = (howMany) => {
  const configuredDefault = normalizeNumber(process.env.DEFAULT_LOAD_VIDPAGES) ?? 5;
  const normalizedValue = normalizeNumber(howMany) ?? configuredDefault;
  return Math.min(Math.max(normalizedValue, 1), 50);
};

const normalizeNumber = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.trunc(number);
};

const buildWatchVidDtos = (watchVids) => {
  const watchVidDtos = [];
  for (const watchVid of watchVids) {
    watchVidDtos.push(buildWatchVidDto(watchVid));
  }
  return watchVidDtos;
};

const buildWatchVidDto = (watchVid) => {
  const { title, date, vidType, vidName, vidSize } = watchVid;
  const mediaPath = trimTrailingSlash(process.env.EXPRESS_WATCH_PATH);

  return {
    title,
    date,
    vidType,
    vidName,
    vidSize,
    mediaUrl: `${mediaPath}/${encodeURIComponent(vidName)}`,
  };
};

const trimTrailingSlash = (path) => path.replace(/\/+$/, "");
