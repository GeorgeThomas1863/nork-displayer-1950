//importing functions defined in map
import { buildArticleDisplay } from "./articles/article-return.js";
import { buildPicAloneDisplay } from "./pics/pic-return-alone.js";
import { buildPicSetDisplay } from "./pics/pic-return-pic-set.js";
import { buildVidAloneDisplay } from "./vids/vid-return-alone.js";
import { buildVidPageDisplay } from "./vids/vid-return-vid-page.js";

const d = {
  displayFunctionMap: {
    articles: buildArticleDisplay,
    pics: buildPicAloneDisplay,
    picSets: buildPicSetDisplay,
    vids: buildVidAloneDisplay,
    vidPages: buildVidPageDisplay,
  },
  changeTriggerArr: ["article-type", "article-sort-by", "pic-type", "pic-sort-by", "vid-type", "vid-sort-by"],
  expandTriggerArr: ["article-form-header", "pic-form-header", "vid-form-header"],
  inputTriggerArr: ["article-how-many", "pic-how-many", "vid-how-many"],
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],
  expandTypeArr: ["article", "pic", "vid"],

  // changeIdMap: {
  //   articles: ["article-type", "article-sort-by"],
  //   pics: ["pic-type", "pic-sort-by"],
  //   picSets: ["pic-type", "pic-sort-by"],
  //   vids: ["vid-type", "vid-sort-by"],
  //   vidPages: ["vid-type", "vid-sort-by"],
  // },
};

export default d;
