//importing functions defined in map
import { buildArticleDataDisplay } from "./build/build-articles";
import { buildPicDataDisplay, buildPicSetDataDisplay } from "./build/build-pics";
import { buildVidDataDisplay, buildVidPageDataDisplay } from "./build/build-vids";

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
