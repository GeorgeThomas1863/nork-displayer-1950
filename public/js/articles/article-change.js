import { state, updateStateEventTriggered } from "../util/state.js";

export const changeArticleType = async (articleType) => {
  if (!articleType || articleType === state.articleType) return null;

  //otherwise article is different
  const testData = await updateStateEventTriggered("article-type", articleType);

  console.log("STATE AFTER ");
  console.log(state);

  return true;
};
