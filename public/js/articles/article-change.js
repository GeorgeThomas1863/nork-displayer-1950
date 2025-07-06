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

//executes in STATE (updateStateDataLoaded)
export const updateActiveArticle = async (stateInput) => {
  if (!stateInput || !stateInput.dataReq || !stateInput.dataReq.articleType) return null;
  const { articleType } = stateInput.dataReq;

  const clickedArticleButton = document.querySelector(`[data-article-type="${articleType}"]`);
  const articleButtonArray = document.querySelectorAll(".article-type-button");

  //remove active class from all buttons
  for (let i = 0; i < articleButtonArray.length; i++) {
    const articleButton = articleButtonArray[i];
    articleButton.classList.remove("active");
    if (articleButton !== clickedArticleButton) continue;

    articleButton.classList.add("active");
  }

  return true;
};
