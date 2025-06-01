//importing functions defined in map
import { buildArticleDisplay } from "./articles/article-data.js";
import { buildPicDisplay, buildPicSetDisplay } from "./pics/pic-data.js";
import { buildVidDisplay, buildVidPageDisplay } from "./vids/vid-data.js";

const d = {
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],
  backendFunctionMap: {
    articles: buildArticleDisplay,
    pics: buildPicDisplay,
    picSets: buildPicSetDisplay,
    vids: buildVidDisplay,
    vidPages: buildVidPageDisplay,
  },
};

export default d;
