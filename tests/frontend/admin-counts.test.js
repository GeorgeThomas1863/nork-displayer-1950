import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../../public/js/admin/admin-sort-tbl.js", () => ({
  setAdminTableData: vi.fn(),
}));
vi.mock("../../public/js/control/return-form.js", () => ({
  buildEmptyDisplay: vi.fn(),
}));
vi.mock("../../public/js/util/collapse-display.js", () => ({
  buildCollapseContainer: vi.fn(),
}));

import { buildAdminReturnDisplay, buildAdminStatsSection } from "../../public/js/admin/admin-return.js";

function createElement() {
  return {
    className: "",
    textContent: "",
    children: [],
    append(...items) {
      for (const item of items) this.children.push(item);
    },
    appendChild(item) {
      this.children.push(item);
      return item;
    },
  };
}

beforeAll(() => {
  vi.stubGlobal("document", { createElement });
});

describe("admin collection counts", () => {
  it("renders an admin data failure instead of zero totals", async () => {
    const result = await buildAdminReturnDisplay({
      success: false,
      message: "Unable to load admin data",
      data: { status: 503 },
    });

    expect(result.children[0].textContent).toBe("Unable to load admin data");
  });

  it("renders exact backend totals including videos", async () => {
    const input = [
      { collection: "log", count: 601, data: [] },
      { collection: "articles", count: 725, data: [{}] },
      { collection: "pics", count: 640, data: [{}] },
      { collection: "picSets", count: 530, data: [{}] },
      { collection: "vidPages", count: 612, data: [{}] },
    ];

    const section = await buildAdminStatsSection(input);
    const statsBar = section.children[0];
    const stats = {};
    for (const statItem of statsBar.children) {
      stats[statItem.children[0].textContent] = statItem.children[1].textContent;
    }

    expect(stats.Total).toBe(601);
    expect(stats.Articles).toBe(725);
    expect(stats.Pics).toBe(640);
    expect(stats["Pic Sets"]).toBe(530);
    expect(stats.Videos).toBe(612);
  });
});
