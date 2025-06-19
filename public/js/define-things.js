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

  defaultInputMap: {
    articleType: "fatboy",
    articleHowMany: 5,
    articleSortBy: "article-newest-to-oldest",
    picType: "pic-alone",
    picHowMany: 6,
    picSortBy: "pic-newest-to-oldest",
    vidType: "vid-alone",
    vidHowMany: 1,
    vidSortBy: "vid-newest-to-oldest",
  },
};

export default d;
