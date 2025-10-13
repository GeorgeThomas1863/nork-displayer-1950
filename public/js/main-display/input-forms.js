import { buildArticlesForm } from "../articles/articles-form.js";
import { buildPicsForm } from "../pics/pics-form.js";
import { buildVidsForm } from "../vids/vids-form.js";
// import { buildWatchForm } from "../watch/watch-form.js";
import { defineCollapseItems } from "../util/collapse-display.js";

export const buildInputForms = async () => {
  const inputFormWrapper = document.createElement("div");
  inputFormWrapper.id = "input-form-wrapper";

  const articleFormWrapper = await buildArticlesForm();

  const picFormWrapper = await buildPicsForm();

  // const watchFormWrapper = await buildWatchForm();

  const vidFormWrapper = await buildVidsForm();

  //try adding as collapse "group"
  // await defineCollapseItems([articleFormWrapper, picFormWrapper, vidFormWrapper, watchFormWrapper]);
  await defineCollapseItems([articleFormWrapper, picFormWrapper, vidFormWrapper]);

  inputFormWrapper.append(articleFormWrapper, picFormWrapper, vidFormWrapper);

  return inputFormWrapper;
};
