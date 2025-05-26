import { buildArticleForm } from "./parse-articles.js";
import { buildPicAloneForm, buildPicSetForm } from "./parse-pics.js";
import { buildVidPageForm } from "./parse-vids.js";

export const buildInputForms = async () => {
  const formWrapperElement = document.createElement("div");
  formWrapperElement.id = "form-wrapper";

  const articleFormWrapper = await buildArticleForm();

  const picAloneFormWrapper = await buildPicAloneForm();

  //BUILD PIC SET WRAPPER
  const picSetFormWrapper = await buildPicSetForm();

  //BUILD VID PAGE WRAPPER
  const vidPageFormWrapper = await buildVidPageForm();

  formWrapperElement.append(articleFormWrapper, picAloneFormWrapper, picSetFormWrapper, vidPageFormWrapper);

  //DELETE
  return formWrapperElement;
};
