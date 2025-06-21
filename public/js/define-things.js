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
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],

  //expand triggers
  expandTriggerArr: ["article-form-header", "pic-form-header", "vid-form-header"],
  expandIdsArr: ["article-array-element", "pic-array-element", "pic-set-array-element", "vid-array-element", "vid-page-array-element"],
  expandTypeArr: ["article", "pic", "vid"],

  //change triggers
  changeTriggerArr: ["article-type", "article-sort-by", "pic-type", "pic-sort-by", "vid-type", "vid-sort-by"],
  inputTriggerArr: ["article-how-many", "pic-how-many", "vid-how-many"],

  defaultInputMap: {
    articleType: "fatboy",
    articleHowMany: 5,
    articleSortBy: "article-newest-to-oldest",
    picType: "pic-alone",
    picHowMany: 6,
    picSortBy: "pic-newest-to-oldest",
    vidType: "vid-pages",
    vidHowMany: 1,
    vidSortBy: "vid-newest-to-oldest",
  },

  articleTriggerValues: ["article-type", "article-sort-by", "article-how-many"],
  picTriggerValues: ["pic-type", "pic-sort-by", "pic-how-many"],
  vidTriggerValues: ["vid-type", "vid-sort-by", "vid-how-many"],

  triggerTypeMap(value) {
    if (this.articleTriggerValues.includes(value)) {
      return "articles";
    } else if (this.picTriggerValues.includes(value)) {
      return "pics";
    } else if (this.vidTriggerValues.includes(value)) {
      return "vids";
    }
    return null;
  },
};

export default d;
