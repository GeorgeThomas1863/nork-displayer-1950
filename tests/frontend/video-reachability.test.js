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
      dataObj: { articles: {}, pics: null, vids: null },
    },
    articleForm: createElement("article-form"),
    picForm: createElement("pic-form"),
    vidForm: createElement("vid-form"),
    vidReturnDisplay: createElement("vid-return-display"),
    defineCollapseItems: vi.fn(),
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
  buildVidsReturnDisplay: vi.fn().mockResolvedValue(mocks.vidReturnDisplay),
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
import { buildVidsReturnDisplay } from "../../public/js/vids/vids-return.js";

beforeAll(() => {
  vi.stubGlobal("document", { createElement: () => mocks.createElement() });
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.stateFront.typeTrigger = "articles";
});

//vids were restored to the site 2026-09-26; these assert the dropdown is back
describe("video UI present", () => {
  it("builds the article, pic, and vid forms in order, even with no video data", async () => {
    const forms = await buildInputForms();

    expect(forms.children).toEqual([mocks.articleForm, mocks.picForm, mocks.vidForm]);
    expect(mocks.defineCollapseItems).toHaveBeenCalledWith([mocks.articleForm, mocks.picForm, mocks.vidForm]);
  });

  it("calls buildVidsReturnDisplay for a vids display trigger", async () => {
    mocks.stateFront.typeTrigger = "vids";

    const result = await buildReturnDisplay([{ title: "reachable again" }]);

    expect(buildVidsReturnDisplay).toHaveBeenCalledWith([{ title: "reachable again" }]);
    expect(result.children).toEqual([mocks.vidReturnDisplay]);
  });
});
