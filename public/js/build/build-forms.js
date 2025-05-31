import { buildArticleForm } from "./build-articles.js";
import { buildPicForm } from "./build-pics.js";
import { buildVidForm } from "./build-vids.js";

export const buildInputForms = async () => {
  const formWrapperElement = document.createElement("div");
  formWrapperElement.id = "form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picFormWrapper = await buildPicForm();

  const vidFormWrapper = await buildVidForm();

  formWrapperElement.append(articleFormWrapper, picFormWrapper, vidFormWrapper);

  return formWrapperElement;
};
