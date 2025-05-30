import { buildInputParams, sendToBack } from "../util.js";
import { buildArticleData } from "../parse/parse-articles.js";

//GET NEW DATA SECTION
export const checkNewArticleData = async () => {
  //get defaults

  const articleDefaultArray = ["fatboy", 5, "article-newest-to-oldest"];

  //get user input
  const inputParams = await buildInputParams();
  if (!inputParams || !inputParams.articleType || !inputParams.articleHowMany || !inputParams.articleSortBy) return null;

  // instract out article inputs
  const { articleType, articleHowMany, articleSortBy } = inputParams;
  const articleInputArray = [articleType, articleHowMany, articleSortBy];

  //set route
  inputParams.route = "/get-new-article-data-route";

  let newArticleData;
  for (let i = 0; i < articleDefaultArray.length; i++) {
    if (articleDefaultArray[i] !== articleInputArray[i]) {
      //define route, send to back
      newArticleData = await sendToBack(inputParams);
      //break if shit returns
      if (newArticleData) break;
    }
  }

  console.log("NEW ARTICLE DATA");
  console.log(newArticleData);

  if (!newArticleData) return null;

  const newArticleDataWrapper = await buildArticleData(newArticleData);

  //get backend data wrapper
  const backendDataWrapper = document.getElementById("backend-data-wrapper");
  const articleArrayElement = document.getElementById("article-array-element");

  console.log("%%%%ARTICLE ARRAY ELEMENT");
  console.log(articleArrayElement);

  //please work
  backendDataWrapper.replaceChildren(newArticleDataWrapper, articleArrayElement);

  console.log("!!!NEW ARTICLE DATA WRAPPER");
  console.log(newArticleDataWrapper);

  console.log("BACKEND DATA WRAPPER");
  console.log(backendDataWrapper);

  return true;
};
