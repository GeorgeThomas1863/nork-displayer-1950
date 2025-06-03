//importing functions defined in map
import { buildArticleDisplay } from "./articles/article-parse.js";
import { buildPicAloneDisplay } from "./pics/pic-parse-alone.js";
import { buildPicSetDisplay } from "./pics/pic-parse-pic-set.js";
import { buildVidAloneDisplay } from "./vids/vid-parse-alone.js";
import { buildVidPageDisplay } from "./vids/vid-parse-vid-page.js";

const d = {
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],
  displayFunctionMap: {
    articles: buildArticleDisplay,
    pics: buildPicAloneDisplay,
    picSets: buildPicSetDisplay,
    vids: buildVidAloneDisplay,
    vidPages: buildVidPageDisplay,
  },
  clickTriggerArr: ["article-type", "article-sort-by", "pic-type", "pic-sort-by", "vid-type", "vid-sort-by"],
  expandTriggerArr: ["article-form-header", "pic-form-header", "vid-form-header"],
  inputTriggerArr: ["article-how-many", "pic-how-many", "vid-how-many"],
  // newDataDisplayMap: {
  //   articles: buildNewArticleDisplay,
  //   pics: buildNewPicDisplay,
  //   picSets: buildNewPicSetDisplay,
  //   vids: buildNewVidDisplay,
  //   vidPages: buildNewVidPageDisplay,
  // },
};

export default d;
