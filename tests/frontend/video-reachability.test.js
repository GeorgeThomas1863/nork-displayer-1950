import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const createElement = (id = "") => ({
    id,
    children: [],
    append(...items) {
      for (const item of items) this.children.push(item);
    },
  });

  return {
    createElement,
    stateFront: {
      typeTrigger: "articles",
      dataObj: { articles: {}, pics: null, vids: 1 },
    },
    articleForm: createElement("article-form"),
    picForm: createElement("pic-form"),
    vidForm: createElement("vid-form"),
    videoResult: createElement("video-result"),
    defineCollapseItems: vi.fn(),
    buildVidsReturnDisplay: vi.fn(),
  };
});

vi.mock("../../public/js/articles/articles-form.js", () => ({
  buildArticlesForm: vi.fn().mockResolvedValue(mocks.articleForm),
}));
vi.mock("../../public/js/pics/pics-form.js", () => ({
  buildPicsForm: vi.fn().mockResolvedValue(mocks.picForm),
}));
vi.mock("../../public/js/vids/vids-form.js", () => ({
  buildVidsForm: vi.fn().mockResolvedValue(mocks.vidForm),
}));
vi.mock("../../public/js/articles/articles-return.js", () => ({
  buildArticlesReturnDisplay: vi.fn(),
}));
vi.mock("../../public/js/pics/pics-return.js", () => ({
  buildPicsReturnDisplay: vi.fn(),
}));
vi.mock("../../public/js/vids/vids-return.js", () => ({
  buildVidsReturnDisplay: mocks.buildVidsReturnDisplay,
}));
vi.mock("../../public/js/util/collapse-display.js", () => ({
  defineCollapseItems: mocks.defineCollapseItems,
}));
vi.mock("../../public/js/util/state-front.js", () => ({
  default: mocks.stateFront,
  dataObjExistsCheck: vi.fn().mockResolvedValue(true),
}));

import { buildInputForms } from "../../public/js/control/input-forms.js";
import { buildReturnDisplay } from "../../public/js/control/return-form.js";

beforeAll(() => {
  vi.stubGlobal("document", { createElement: () => mocks.createElement() });
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.stateFront.typeTrigger = "articles";
  mocks.buildVidsReturnDisplay.mockResolvedValue(mocks.videoResult);
});

describe("video UI reachability", () => {
  it("includes the existing video selector and dispatches video results", async () => {
    const forms = await buildInputForms();

    expect(forms.children).toContain(mocks.vidForm);
    expect(mocks.defineCollapseItems).toHaveBeenCalledWith([
      mocks.articleForm,
      mocks.picForm,
      mocks.vidForm,
    ]);

    mocks.stateFront.typeTrigger = "vids";
    const input = [{ title: "Reachable video" }];
    const result = await buildReturnDisplay(input);

    expect(mocks.buildVidsReturnDisplay).toHaveBeenCalledWith(input);
    expect(result.children).toContain(mocks.videoResult);
  });
});
