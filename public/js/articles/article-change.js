import { buildDisplay } from "../main.js";
import { state, updateStateEventTriggered } from "../util/state.js";

export const changeArticleType = async (articleType) => {
  if (!articleType || articleType === state.articleType) return null;

  //otherwise article is different [always get new data]
  const updateArticleState = await updateStateEventTriggered(articleType, "article-type");
  if (!updateArticleState) return null;

  //update active article
  const articleButtonArray = document.querySelectorAll(".article-type-button");

  //remove active class from all buttons
  for (let i = 0; i < articleButtonArray.length; i++) {
    const articleButton = articleButtonArray[i];
    if (!articleButton.classList.contains("active")) continue;
    articleButton.classList.remove("active");
  }

  //add active class to the new button
  const newArticleButton = document.querySelector(`#article-type-button-list [value="${articleType}"]`);
  
  console.log("NEW ARTICLE BUTTON");
  console.log(newArticleButton);
  if (newArticleButton) newArticleButton.classList.add("active");

  //re-run build display
  await buildDisplay();

  return true;
};
