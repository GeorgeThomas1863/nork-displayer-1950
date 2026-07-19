import { buildArticlesForm } from "../articles/articles-form.js";
import { buildPicsForm } from "../pics/pics-form.js";
import { buildVidsForm } from "../vids/vids-form.js";
import { defineCollapseItems } from "../util/collapse-display.js";

export const buildInputForms = async () => {
  const inputFormWrapper = document.createElement("div");
  inputFormWrapper.id = "input-form-wrapper";

  const articleFormWrapper = await buildArticlesForm();

  const picFormWrapper = await buildPicsForm();
  const vidFormWrapper = await buildVidsForm();

  // const watchFormWrapper = await buildWatchForm();

  //try adding as collapse "group"
  await defineCollapseItems([articleFormWrapper, picFormWrapper, vidFormWrapper]);

  inputFormWrapper.append(articleFormWrapper, picFormWrapper, vidFormWrapper);

  return inputFormWrapper;
};
