import { buildDisplay } from "../main.js";
import { state, updateStateEventTriggered } from "../util/state.js";

export const changeArticleType = async (articleType) => {
  if (!articleType || articleType === state.articleType) return null;

  //otherwise article is different
  const testData = await updateStateEventTriggered(articleType, "article-type");

  console.log("STATE AFTER ");
  console.dir(state);

  await buildDisplay();

  return true;
};
