//importing functions defined in map
import { buildDefaultArticleDisplay, buildNewArticleDisplay } from "./articles/article-parse.js";
import { buildDefaultPicDisplay, buildNewPicDisplay } from "./pics/pic-parse-alone.js";
import { buildDefaultPicSetDisplay, buildNewPicSetDisplay } from "./pics/pic-parse-pic-set.js";
import { buildDefaultVidDisplay, buildNewVidDisplay } from "./vids/vid-parse-alone.js";
import { buildDefaultVidPageDisplay, buildNewVidPageDisplay } from "./vids/vid-parse-vid-page.js";

const d = {
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],
  defaultDataDisplayMap: {
    articles: buildDefaultArticleDisplay,
    pics: buildDefaultPicDisplay,
    picSets: buildDefaultPicSetDisplay,
    vids: buildDefaultVidDisplay,
    vidPages: buildDefaultVidPageDisplay,
  },
  clickTriggerArr: ["article-type", "article-sort-by", "pic-type", "pic-sort-by", "vid-type", "vid-sort-by"],
  expandTriggerArr: ["article-form-header", "pic-form-header", "vid-form-header"],
  inputTriggerArr: ["article-how-many", "pic-how-many", "vid-how-many"],
  newDataDisplayMap: {
    articles: buildNewArticleDisplay,
    pics: buildNewPicDisplay,
    picSets: buildNewPicSetDisplay,
    vids: buildNewVidDisplay,
    vidPages: buildNewVidPageDisplay,
  },
};

export default d;
