import { buildArticleForm } from "./articles/article-form.js";
import { buildPicForm } from "./pics/pic-form.js";
import { buildVidForm } from "./vids/vid-form.js";

export const buildInputForms = async () => {
  const formWrapperElement = document.createElement("div");
  formWrapperElement.id = "form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picFormWrapper = await buildPicForm();

  const vidFormWrapper = await buildVidForm();

  formWrapperElement.append(articleFormWrapper, picFormWrapper, vidFormWrapper);

  return formWrapperElement;
};
