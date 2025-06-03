//importing functions defined in map
import { buildArticleDisplay } from "./articles/article-return.js";
import { buildPicAloneDisplay } from "./pics/pic-return-alone.js";
import { buildPicSetDisplay } from "./pics/pic-return-pic-set.js";
import { buildVidAloneDisplay } from "./vids/vid-return-alone.js";
import { buildVidPageDisplay } from "./vids/vid-return-vid-page.js";

const d = {
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],
  formTypeArr: ["article", "pic", "vid"],
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
};

export default d;
