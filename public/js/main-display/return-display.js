//BUILD
import stateFront from "../util/state-front.js";
import { dataObjExistsCheck } from "../util/state-front.js";
import { buildArticlesReturnDisplay } from "../articles/articles-return.js";
import { buildPicsReturnDisplay } from "../pics/pics-return.js";
import { buildVidsReturnDisplay } from "../vids/vids-return.js";

export const buildReturnDisplay = async (inputArray) => {
  const { typeTrigger } = stateFront;

  let data = "";
  const returnDisplayWrapper = document.createElement("div");
  returnDisplayWrapper.id = "return-display-wrapper";

  //returns empty display if no data
  const dataObjExists = await dataObjExistsCheck();
  if (!dataObjExists) data = await buildEmptyDisplay();

  switch (typeTrigger) {
    case "articles":
      data = await buildArticlesReturnDisplay(inputArray);
      break;
    case "pics":
      data = await buildPicsReturnDisplay(inputArray);
      break;
    case "vids":
      data = await buildVidsReturnDisplay(inputArray);
      break;
    default:
      return null;
  }

  returnDisplayWrapper.append(data);

  return returnDisplayWrapper;
};

export const buildEmptyDisplay = async () => {
  const emptyDisplayWrapper = document.createElement("div");
  emptyDisplayWrapper.id = "empty-display-wrapper";

  const emptyDisplayText = document.createElement("p");
  emptyDisplayText.textContent = "NO DATA TO DISPLAY. RUN THE SCRAPER.";
  emptyDisplayWrapper.append(emptyDisplayText);

  return emptyDisplayWrapper;
};
