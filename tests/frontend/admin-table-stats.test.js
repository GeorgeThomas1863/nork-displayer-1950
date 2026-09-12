import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../../public/js/admin/admin-sort-tbl.js", () => ({
  applySortIcons: vi.fn(),
}));
vi.mock("../../public/js/control/return-form.js", () => ({
  buildEmptyDisplay: vi.fn(),
}));
vi.mock("../../public/js/util/collapse-display.js", () => ({
  buildCollapseContainer: vi.fn(),
}));

import {
  buildAdminTableHeader,
  buildAdminTableRow,
  buildStatCell,
  getScrapeStat,
} from "../../public/js/admin/admin-return.js";

function createElement(tag) {
  return {
    tag,
    className: "",
    textContent: "",
    attributes: {},
    children: [],
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
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

const EXPECTED_COLUMNS = [
  "id",
  "status",
  "startTime",
  "endTime",
  "duration",
  "articles",
  "pics",
  "picSets",
  "step",
  "message",
  "active",
];

const EXPECTED_STAT_HEADERS = ["Articles", "Pics", "Pic Sets"];

const baseLog = {
  _id: "abc123",
  scrapeActive: false,
  scrapeError: null,
  scrapeStartTime: "2026-01-01T00:00:00Z",
  scrapeEndTime: "2026-01-01T00:01:00Z",
  scrapeLengthSeconds: 60,
  scrapeStep: "done",
  scrapeMessage: "ok",
};

//stat cells sit between Duration (index 4) and Step (index 8)
const getStatCells = (row) => row.children.slice(5, 8);

describe("buildAdminTableHeader scrape stat columns", () => {
  it("has the three stat columns between duration and step, in order", async () => {
    const thead = await buildAdminTableHeader();
    const ths = thead.children[0].children;

    const columns = [];
    for (const th of ths) columns.push(th.attributes["data-column"]);
    expect(columns).toEqual(EXPECTED_COLUMNS);
  });

  it("uses the expected header texts for the stat columns", async () => {
    const thead = await buildAdminTableHeader();
    const ths = thead.children[0].children.slice(5, 8);

    const texts = [];
    for (const th of ths) texts.push(th.textContent.trim());
    expect(texts).toEqual(EXPECTED_STAT_HEADERS);
  });
});

describe("buildAdminTableRow scrape stat cells", () => {
  it("renders mongo doc counts from scrapeStats, including zero", async () => {
    const row = await buildAdminTableRow({
      ...baseLog,
      scrapeStats: { articles: 0, pics: 45, picSets: 3 },
    });

    const cells = getStatCells(row);
    const texts = [];
    const classes = [];
    for (const cell of cells) {
      texts.push(cell.textContent);
      classes.push(cell.className);
    }

    expect(texts).toEqual(["0", "45", "3"]);
    expect(classes).toEqual(Array(3).fill("stat-cell"));
    expect(row.children).toHaveLength(11);
  });

  it("renders a dash with null-value class when scrapeStats is missing", async () => {
    const row = await buildAdminTableRow({ ...baseLog });

    const cells = getStatCells(row);
    for (const cell of cells) {
      expect(cell.textContent).toBe("—");
      expect(cell.className).toBe("null-value");
    }
    expect(row.children).toHaveLength(11);
  });

  it("renders a dash for an individual stat key missing from scrapeStats", async () => {
    const row = await buildAdminTableRow({ ...baseLog, scrapeStats: { articles: 5 } });

    const cells = getStatCells(row);
    expect(cells[0].textContent).toBe("5");
    expect(cells[1].textContent).toBe("—");
    expect(cells[1].className).toBe("null-value");
  });
});

describe("stat helpers", () => {
  it("getScrapeStat returns null without scrapeStats and the value otherwise", () => {
    expect(getScrapeStat(null, "pics")).toBeNull();
    expect(getScrapeStat({}, "pics")).toBeNull();
    expect(getScrapeStat({ scrapeStats: {} }, "pics")).toBeNull();
    expect(getScrapeStat({ scrapeStats: { pics: 0 } }, "pics")).toBe(0);
    expect(getScrapeStat({ scrapeStats: { pics: 9 } }, "pics")).toBe(9);
  });

  it("buildStatCell renders 0 as a number and null as a dash", () => {
    const zeroCell = buildStatCell(0);
    expect(zeroCell.textContent).toBe("0");
    expect(zeroCell.className).toBe("stat-cell");

    const nullCell = buildStatCell(null);
    expect(nullCell.textContent).toBe("—");
    expect(nullCell.className).toBe("null-value");

    const undefinedCell = buildStatCell(undefined);
    expect(undefinedCell.textContent).toBe("—");
  });
});
