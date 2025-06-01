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
};

export default d;
