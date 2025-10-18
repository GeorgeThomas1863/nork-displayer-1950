import { getNewArticles } from "./kcna/articles.js";
import { getNewPics } from "./kcna/pics.js";
import { getNewVids } from "./kcna/vids.js";

export const runUpdateData = async (inputParams) => {
  if (!inputParams) return null;
  const { typeTrigger } = inputParams;

  const newDataNeeded = await checkNewDataNeeded(inputParams);
  if (!newDataNeeded) return null;

  console.log("RUN UPDATE PARAMS");
  console.log(inputParams);

  let dataArray = null;
  switch (typeTrigger) {
    case "articles":
      dataArray = await getNewArticles(inputParams);
      break;
    case "pics":
      dataArray = await getNewPics(inputParams);
      break;
    case "vids":
      dataArray = await getNewVids(inputParams);
      break;
    default:
      return null;
  }

  console.log(`${dataArray?.length} NEW ${typeTrigger} ITEMS`);
  return dataArray;
};

//BUILD
export const checkNewDataNeeded = async (inputParams) => {
  const { isFirstLoad } = inputParams;

  if (isFirstLoad) return true;

  //BUILD
  return true;
};
