import { describe, expect, it, vi, beforeEach } from "vitest";

const countDocuments = vi.fn();
const toArray = vi.fn();
const limit = vi.fn(() => ({ toArray }));
const sort = vi.fn(() => ({ limit }));
const find = vi.fn(() => ({ sort }));
const aggregate = vi.fn(() => ({ toArray }));
const collection = vi.fn(() => ({ countDocuments, find, aggregate }));

vi.mock("../../middleware/db-config.js", () => ({
  dbGet: vi.fn(() => ({ collection })),
}));

import dbModel from "../../models/db-model.js";

describe("dbModel.countAll", () => {
  it("returns the direct MongoDB collection count", async () => {
    countDocuments.mockResolvedValue(725);
    const model = new dbModel("", "articles");

    const result = await model.countAll();

    expect(collection).toHaveBeenCalledWith("articles");
    expect(countDocuments).toHaveBeenCalledWith({});
    expect(result).toBe(725);
  });
});

describe("dbModel.getSortedItemsArray", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sorts by the exact sort object, limits by howMany, and returns the array", async () => {
    const sortObj = { scrapeEndTime: -1, _id: -1 };
    const rows = [{ _id: "1" }, { _id: "2" }];
    toArray.mockResolvedValue(rows);
    const model = new dbModel({ sortObj, howMany: 25 }, "log");

    const result = await model.getSortedItemsArray();

    expect(collection).toHaveBeenCalledWith("log");
    expect(find).toHaveBeenCalledWith();
    expect(sort).toHaveBeenCalledWith(sortObj);
    expect(limit).toHaveBeenCalledWith(25);
    expect(result).toBe(rows);
  });
});

describe("dbModel.getLogStatsSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the expected aggregation pipeline to aggregate()", async () => {
    toArray.mockResolvedValue([]);
    const model = new dbModel("", "log");

    await model.getLogStatsSummary();

    expect(collection).toHaveBeenCalledWith("log");
    expect(aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: null,
          activeScrapes: { $sum: { $cond: [{ $eq: ["$scrapeActive", true] }, 1, 0] } },
          errorScrapes: { $sum: { $cond: [{ $eq: ["$scrapeError", true] }, 1, 0] } },
          finishedScrapes: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$scrapeEndTime", null] }, { $ne: ["$scrapeError", true] }] },
                1,
                0,
              ],
            },
          },
          avgDuration: { $avg: "$scrapeLengthSeconds" },
        },
      },
    ]);
  });

  it("unwraps a result row into the plain summary shape and rounds avgDuration up", async () => {
    toArray.mockResolvedValue([
      { _id: null, activeScrapes: 2, finishedScrapes: 5, errorScrapes: 1, avgDuration: 12.6 },
    ]);
    const model = new dbModel("", "log");

    const result = await model.getLogStatsSummary();

    expect(result).toEqual({ activeScrapes: 2, finishedScrapes: 5, errorScrapes: 1, avgDuration: 13 });
  });

  it("rounds avgDuration down when under the midpoint", async () => {
    toArray.mockResolvedValue([
      { _id: null, activeScrapes: 0, finishedScrapes: 1, errorScrapes: 0, avgDuration: 12.4 },
    ]);
    const model = new dbModel("", "log");

    const result = await model.getLogStatsSummary();

    expect(result.avgDuration).toBe(12);
  });

  it("returns all zeros when the collection is empty (aggregation yields no rows)", async () => {
    toArray.mockResolvedValue([]);
    const model = new dbModel("", "log");

    const result = await model.getLogStatsSummary();

    expect(result).toEqual({ activeScrapes: 0, finishedScrapes: 0, errorScrapes: 0, avgDuration: 0 });
  });

  it("returns avgDuration 0 when no durations exist to average (null $avg)", async () => {
    toArray.mockResolvedValue([
      { _id: null, activeScrapes: 1, finishedScrapes: 0, errorScrapes: 0, avgDuration: null },
    ]);
    const model = new dbModel("", "log");

    const result = await model.getLogStatsSummary();

    expect(result.avgDuration).toBe(0);
  });
});
