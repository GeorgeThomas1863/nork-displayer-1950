import CONFIG from "../../../config/config.js";
import { buildInputParams } from "../util.js";

//GET NEW DATA SECTION
export const getNewArticleData = async () => {
  //get defaults
  const { defaultArticleArray } = CONFIG;

  //get user input
  const inputParams = await buildInputParams();
  const { articleType, articleHowMany, articleSortBy } = inputParams;
  const articleInputArray = [articleType, articleHowMany, articleSortBy];

  for (let i = 0; i < defaultArticleArray.length; i++) {
    if (defaultArticleArray[i] !== articleInputArray[i]) {
      console.log("ALLAHU AKBAR");
      break; // Exit early once we find a mismatch
    }
  }
};
