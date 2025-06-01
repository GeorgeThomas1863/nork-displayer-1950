//importing functions defined in map
import { buildArticleDataDisplay } from "./build/build-articles.js";
import { buildPicDataDisplay, buildPicSetDataDisplay } from "./build/build-pics.js";
import { buildVidDataDisplay, buildVidPageDataDisplay } from "./build/build-vids.js";

const d = {
  backendTypeArr: ["articles", "pics", "picSets", "vids", "vidPages"],
  backendFunctionMap: {
    articles: buildArticleDataDisplay,
    pics: buildPicDataDisplay,
    picSets: buildPicSetDataDisplay,
    vids: buildVidDataDisplay,
    vidPages: buildVidPageDataDisplay,
  },
};

export default d;
