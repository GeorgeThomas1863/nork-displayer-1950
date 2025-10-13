import { buildArticleForm } from "../articles/article-form.js";
import { buildPicForm } from "../pics/pic-form.js";
import { buildVidForm } from "../vids/vid-form.js";
import { buildWatchForm } from "../watch/watch-form.js";
import { defineCollapseItems } from "./util/collapse.js";

export const buildInputForms = async () => {
  const inputFormWrapper = document.createElement("div");
  inputFormWrapper.id = "input-form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picFormWrapper = await buildPicForm();

  // const watchFormWrapper = await buildWatchForm();

  const vidFormWrapper = await buildVidForm();

  //try adding as collapse "group"
  await defineCollapseItems([articleFormWrapper, picFormWrapper, vidFormWrapper, watchFormWrapper]);

  formWrapperElement.append(articleFormWrapper, picFormWrapper, vidFormWrapper, watchFormWrapper);

  return formWrapperElement;
};
