//importing functions defined in map
import { buildArticleDisplay } from "./build/build-articles.js";
import { buildPicDisplay, buildPicSetDisplay } from "./build/build-pics.js";
import { buildVidDisplay, buildVidPageDisplay } from "./build/build-vids.js";

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
