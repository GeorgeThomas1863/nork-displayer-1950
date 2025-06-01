//importing functions defined in map
import { buildArticleReturnDisplay } from "./articles/article-return.js";
import { buildPicReturnDisplay } from "./pics/pic-return-alone.js";
import { buildPicSetReturnDisplay } from "./pics/pic-return-pic-set.js";
import { buildVidReturnDisplay } from "./vids/vid-return-alone.js";
import { buildVidPageReturnDisplay } from "./vids/vid-return-vid-page.js";

const d = {
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],
  backendFunctionMap: {
    articles: buildArticleReturnDisplay,
    pics: buildPicReturnDisplay,
    picSets: buildPicSetReturnDisplay,
    vids: buildVidReturnDisplay,
    vidPages: buildVidPageReturnDisplay,
  },
  clickTriggerArr: ["article-type", "article-sort-by", "pic-type", "pic-sort-by", "vid-type", "vid-sort-by"],
  expandTriggerArr: ["article-form-header", "pic-form-header", "vid-form-header"],
  inputTriggerArr: ["article-how-many", "pic-how-many", "vid-how-many"],
};

export default d;
