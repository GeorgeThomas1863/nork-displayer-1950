import { buildArticleForm } from "../articles/article-form.js";
import { buildPicForm } from "../pics/pic-form.js";
import { buildVidForm } from "../vids/vid-form.js";
import { defineCollapseItems } from "../util/collapse.js";

export const buildInputForms = async () => {
  const formWrapperElement = document.createElement("div");
  formWrapperElement.id = "form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picFormWrapper = await buildPicForm();

  const vidFormWrapper = await buildVidForm();

  //try adding as collapse "group"
  await defineCollapseItems([articleFormWrapper, picFormWrapper, vidFormWrapper]);

  formWrapperElement.append(articleFormWrapper, picFormWrapper, vidFormWrapper);

  return formWrapperElement;
};
