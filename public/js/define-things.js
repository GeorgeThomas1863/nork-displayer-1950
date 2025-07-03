//importing functions defined in map
import { buildArticleDisplay } from "./articles/article-return.js";
import { buildPicDisplay } from "./pics/pic-return.js";
import { buildVidDisplay } from "./vids/vid-return.js";

const d = {
  displayFunctionMap: {
    articles: buildArticleDisplay,
    pics: buildPicDisplay,
    vids: buildVidDisplay,
  },

  //expand triggers
  expandTriggerArr: ["article-form-header", "pic-form-header", "vid-form-header"],
  expandIdsArr: ["article-array-element", "pic-array-element", "vid-array-element"],
  expandTypeArr: ["article", "pic", "vid"],

  //change triggers
  changeTriggerArr: ["article-type", "article-sort-by", "pic-sort-by", "vid-sort-by"],
  inputTriggerArr: ["article-how-many", "pic-how-many", "vid-how-many"],

  defaultInputMap: {
    articleType: "fatboy",
    articleHowMany: 5,
    articleSortBy: "article-newest-to-oldest",
    picHowMany: 6,
    picSortBy: "pic-newest-to-oldest",
    vidHowMany: 1,
    vidSortBy: "vid-newest-to-oldest",
  },

  defaultDataLoadedMap: {
    articles: 0,
    pics: 0,
    vids: 0,
  },

  articleTriggerValues: ["article-type", "article-sort-by", "article-how-many"],
  picTriggerValues: ["pic-sort-by", "pic-how-many"],
  vidTriggerValues: ["vid-sort-by", "vid-how-many"],

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

  replaceTypeMap: {
    articles: "article-array-element",
    pics: "pic-array-element",
    vids: "vid-array-element",
  },

  adminNewListMap: {
    scrapeStartTime: "Scrape Start Time",
    textStr: "TextStr",
    scrapeEndTime: "Scrape End Time",
    scrapeId: "Scrape ID",
  },

  updateInterval: 60 * 1000, //1 per minute
};

export default d;
