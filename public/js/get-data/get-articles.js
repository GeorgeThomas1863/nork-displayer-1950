import { buildInputParams } from "../util.js";

//GET NEW DATA SECTION
export const getNewArticleData = async () => {
  //get defaults

  const articleDefaultArray = ["fatboy", 5, "article-newest-to-oldest"];

  //get user input
  const inputParams = await buildInputParams();
  console.log("INPUT PARAMS", inputParams);

  const { articleType, articleHowMany, articleSortBy } = inputParams;
  const articleInputArray = [articleType, articleHowMany, articleSortBy];

  for (let i = 0; i < articleDefaultArray.length; i++) {
    if (articleDefaultArray[i] !== articleInputArray[i]) {
      console.log("ALLAHU AKBAR");
      break; // Exit early once we find a mismatch
    }
  }
};
