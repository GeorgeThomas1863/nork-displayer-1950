import { describe, expect, it, vi } from "vitest";

const countDocuments = vi.fn();
const collection = vi.fn(() => ({ countDocuments }));

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
