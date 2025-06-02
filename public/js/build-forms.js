import { buildArticleForm } from "./articles/article-elements.js";
import { buildPicForm } from "./pics/pic-elements.js";
import { buildVidForm } from "./vids/vid-elements.js";

export const buildInputForms = async () => {
  const formWrapperElement = document.createElement("div");
  formWrapperElement.id = "form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picFormWrapper = await buildPicForm();

  const vidFormWrapper = await buildVidForm();

  formWrapperElement.append(articleFormWrapper, picFormWrapper, vidFormWrapper);

  return formWrapperElement;
};
