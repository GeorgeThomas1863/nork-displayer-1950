//BUILD
import stateFront from "../util/state-front.js";
import { buildArticlesReturnDisplay } from "../articles/articles-return.js";
import { buildPicsReturnDisplay } from "../pics/pics-return.js";
import { buildVidsReturnDisplay } from "../vids/vids-return.js";

export const buildReturnDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;
  const { typeTrigger } = stateFront;

  switch (typeTrigger) {
    case "articles":
      return await buildArticlesReturnDisplay(inputArray);
    case "pics":
      return await buildPicsReturnDisplay(inputArray);
    case "vids":
      return await buildVidsReturnDisplay(inputArray);
    default:
      return null;
  }

  return true;
};
