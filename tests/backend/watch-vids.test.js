import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getNewestWatchVidsArray = vi.fn();

vi.mock("../../models/db-model.js", () => ({
  default: vi.fn(function () {
    return { getNewestWatchVidsArray };
  }),
}));

import dbModel from "../../models/db-model.js";
import { getWatchVids } from "../../src/watch/watch-vids.js";

describe("getWatchVids", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DEFAULT_LOAD_VIDPAGES = "8";
    process.env.EXPRESS_WATCH_PATH = "/watch/";
  });

  afterEach(() => {
    delete process.env.DEFAULT_LOAD_VIDPAGES;
    delete process.env.EXPRESS_WATCH_PATH;
  });

  it("uses the configured default when howMany is omitted", async () => {
    getNewestWatchVidsArray.mockResolvedValue([]);

    await getWatchVids();

    expect(dbModel).toHaveBeenCalledWith({ howMany: 8 }, "vidPages");
  });

  it("uses 5 when howMany and the configured default are invalid", async () => {
    process.env.DEFAULT_LOAD_VIDPAGES = "invalid";
    getNewestWatchVidsArray.mockResolvedValue([]);

    await getWatchVids("invalid");

    expect(dbModel).toHaveBeenCalledWith({ howMany: 5 }, "vidPages");
  });

  it.each([
    [0, 1],
    [-4, 1],
    [90, 50],
    [7.9, 7],
  ])("normalizes howMany %s to %s", async (input, expected) => {
    getNewestWatchVidsArray.mockResolvedValue([]);

    await getWatchVids(input);

    expect(dbModel).toHaveBeenCalledWith({ howMany: expected }, "vidPages");
  });

  it("returns safe DTOs with encoded media URLs and no savePath", async () => {
    process.env.EXPRESS_WATCH_PATH = "/watch///";
    getNewestWatchVidsArray.mockResolvedValue([
      {
        title: "Evening broadcast",
        date: "2026-09-13",
        vidType: "broadcast",
        vidName: "folder name+#.mp4",
        vidSize: 12345,
        savePath: "C:/private/video.mp4",
      },
    ]);

    const result = await getWatchVids(1);

    expect(result).toEqual([
      {
        title: "Evening broadcast",
        date: "2026-09-13",
        vidType: "broadcast",
        vidName: "folder name+#.mp4",
        vidSize: 12345,
        mediaUrl: "/watch/folder%20name%2B%23.mp4",
      },
    ]);
    expect(result[0]).not.toHaveProperty("savePath");
  });

  it("returns null without querying when EXPRESS_WATCH_PATH is unset", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.EXPRESS_WATCH_PATH;

    const result = await getWatchVids(5);

    expect(result).toBeNull();
    expect(getNewestWatchVidsArray).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("returns null when the database query throws", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    getNewestWatchVidsArray.mockRejectedValue(new Error("database unavailable"));

    const result = await getWatchVids(5);

    expect(result).toBeNull();
    consoleError.mockRestore();
  });
});
