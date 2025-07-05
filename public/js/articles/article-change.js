import { buildDisplay } from "../main.js";
import { state, updateStateEventTriggered } from "../util/state.js";

export const changeArticleType = async (articleType) => {
  if (!articleType || articleType === state.articleType) return null;

  //otherwise article is different [always get new data]
  const updateArticleState = await updateStateEventTriggered(articleType, "article-type");
  if (!updateArticleState) return null;

  //re-run build display
  await buildDisplay();

  return true;
};
