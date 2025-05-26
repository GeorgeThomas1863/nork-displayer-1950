import { buildArticleForm } from "./parse-articles.js";
import { buildPicForm } from "./parse-pics.js";
import { buildVidPageForm } from "./parse-vids.js";

export const buildInputForms = async () => {
  const formWrapperElement = document.createElement("div");
  formWrapperElement.id = "form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picFormWrapper = await buildPicForm();

  const vidPageFormWrapper = await buildVidPageForm();

  formWrapperElement.append(articleFormWrapper, picFormWrapper, vidPageFormWrapper);

  return formWrapperElement;
};
