import { buildInputParams, sendToBack } from "../util.js";

//GET NEW DATA SECTION
export const checkNewArticleData = async () => {
  //get defaults

  const articleDefaultArray = ["fatboy", 5, "article-newest-to-oldest"];

  //get user input
  const inputParams = await buildInputParams();
  console.log("INPUT PARAMS", inputParams);

  const { articleType, articleHowMany, articleSortBy } = inputParams;
  const articleInputArray = [articleType, articleHowMany, articleSortBy];

  let newArticleData;
  for (let i = 0; i < articleDefaultArray.length; i++) {
    if (articleDefaultArray[i] !== articleInputArray[i]) {
      //define route, send to back
      newArticleData = await getNewArticleData(inputParams);
      //break if shit returns
      if (newArticleData) break;
    }
  }

  if (!newArticleData) return null;

  //
  const articleDataWrapper = await buildArticleData(newArticleData);

  console.log("!!!ARTICLE DATA WRAPPER", articleDataWrapper);

  //NEED TO ADD TO DISPLAY ELEMENT SOMEHOW

};

export const getNewArticleData = async (inputParams) => {
  if (!inputParams || !inputParams.articleType || !inputParams.articleHowMany || !inputParams.articleSortBy) return null;

  inputParams.route = "/get-new-article-data-route";

  //add in other checks for whether to get data from backend

  const newArticleData = await sendToBack(inputParams);
  return newArticleData;
};
