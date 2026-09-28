import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const cssPath = path.resolve(process.cwd(), "public/css/styles.css");

const getVidElementBlock = () => {
  const css = readFileSync(cssPath, "utf8");
  const match = css.match(/\.vid-element\s*\{([^}]*)\}/);
  return match ? match[1] : "";
};

describe(".vid-element sizing (FIX 6 - video box no longer resizes on play)", () => {
  it("has a fixed 5:4 aspect ratio, the min() width formula, and no max-height", () => {
    const block = getVidElementBlock();

    expect(block).toMatch(/aspect-ratio:\s*5\s*\/\s*4\s*;/);
    expect(block).toMatch(
      /width:\s*min\(\s*100%\s*,\s*720px\s*,\s*calc\(\s*70vh\s*\*\s*5\s*\/\s*4\s*\)\s*\)\s*;/
    );
    expect(block).not.toMatch(/max-height/);
  });
});
