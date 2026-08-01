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
    defineCollapseItems: vi.fn(),
  };
});

vi.mock("../../public/js/articles/articles-form.js", () => ({
  buildArticlesForm: vi.fn().mockResolvedValue(mocks.articleForm),
}));
vi.mock("../../public/js/pics/pics-form.js", () => ({
  buildPicsForm: vi.fn().mockResolvedValue(mocks.picForm),
}));
vi.mock("../../public/js/articles/articles-return.js", () => ({
  buildArticlesReturnDisplay: vi.fn(),
}));
vi.mock("../../public/js/pics/pics-return.js", () => ({
  buildPicsReturnDisplay: vi.fn(),
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
});

//vids were removed from the site 2026-08-01; these guard against re-introduction
describe("video UI removal", () => {
  it("builds only the article and pic forms", async () => {
    const forms = await buildInputForms();

    expect(forms.children).toEqual([mocks.articleForm, mocks.picForm]);
    expect(mocks.defineCollapseItems).toHaveBeenCalledWith([mocks.articleForm, mocks.picForm]);
  });

  it("returns null for a vids display trigger", async () => {
    mocks.stateFront.typeTrigger = "vids";

    const result = await buildReturnDisplay([{ title: "no longer reachable" }]);

    expect(result).toBeNull();
  });
});
