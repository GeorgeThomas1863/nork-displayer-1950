import { buildArticleForm } from "../articles/articles-form.js";
import { buildPicForm } from "../pics/pics-form.js";
import { buildVidForm } from "../vids/vids-form.js";
// import { buildWatchForm } from "../watch/watch-form.js";
import { defineCollapseItems } from "../util/collapse-display.js";

export const buildInputForms = async () => {
  const inputFormWrapper = document.createElement("div");
  inputFormWrapper.id = "input-form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picFormWrapper = await buildPicForm();

  // const watchFormWrapper = await buildWatchForm();

  const vidFormWrapper = await buildVidForm();

  //try adding as collapse "group"
  // await defineCollapseItems([articleFormWrapper, picFormWrapper, vidFormWrapper, watchFormWrapper]);
  await defineCollapseItems([articleFormWrapper, picFormWrapper, vidFormWrapper]);

  inputFormWrapper.append(articleFormWrapper, picFormWrapper, vidFormWrapper);

  return inputFormWrapper;
};
