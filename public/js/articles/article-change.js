import { state } from "../util/state.js";

export const changeArticleType = async (articleType) => {
  if (!articleType || articleType === state.articleType) return null;

  console.log("ARTICLE TYPE");
  console.log(articleType);
};
