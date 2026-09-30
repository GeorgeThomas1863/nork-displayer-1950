import { describe, expect, it, vi, beforeEach } from "vitest";

//db-config.js loads dotenv at import time; stub it so the real .env file is never touched by this test
vi.mock("dotenv", () => ({ default: { config: vi.fn() } }));

import { ensureIndexes } from "../../middleware/db-config.js";

const buildFakeDb = (createIndexImpl) => ({
  collection: vi.fn((name) => ({
    createIndex: vi.fn((keys) => createIndexImpl(name, keys)),
  })),
});

describe("ensureIndexes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates every listed index on its own collection and reports full success", async () => {
    const calls = [];
    const db = buildFakeDb((name, keys) => {
      calls.push({ name, keys });
      return Promise.resolve("ok");
    });

    const result = await ensureIndexes(db);

    expect(calls).toEqual([
      { name: "articles", keys: { date: -1, articleId: -1 } },
      { name: "articles", keys: { articleTypeArray: 1, date: -1, articleId: -1 } },
      { name: "pics", keys: { date: -1, picId: -1 } },
      { name: "picSets", keys: { date: -1, picSetId: -1 } },
      { name: "watch", keys: { site: 1, date: -1, vidPageId: -1 } },
    ]);
    expect(result).toEqual({ success: true, message: "5/5 indexes ensured" });
  });

  it("keeps going and reports success:false when one createIndex call rejects", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const calls = [];
    const db = buildFakeDb((name, keys) => {
      calls.push({ name, keys });
      if (name === "pics") {
        return Promise.reject(new Error("index conflict"));
      }
      return Promise.resolve("ok");
    });

    const result = await ensureIndexes(db);

    //all five indexes were still attempted despite the pics failure
    expect(calls).toHaveLength(5);
    expect(result).toEqual({ success: false, message: "4/5 indexes ensured" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('failed on collection "pics"')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("index conflict"));

    consoleErrorSpy.mockRestore();
  });

  it("never throws, even when every createIndex call rejects", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const db = buildFakeDb(() => Promise.reject(new Error("boom")));

    await expect(ensureIndexes(db)).resolves.toEqual({
      success: false,
      message: "0/5 indexes ensured",
    });

    consoleErrorSpy.mockRestore();
  });
});
