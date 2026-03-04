#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function main() {
  const projectRoot = process.cwd();

  const source = path.join(
    projectRoot,
    "node_modules",
    "next",
    "dist",
    "compiled",
    "@vercel",
    "og",
    "noto-sans-v27-latin-regular.ttf"
  );

  const destDir = path.join(projectRoot, "public", "fonts");
  const dest = path.join(destDir, "NotoSans-Regular.ttf");

  if (!fs.existsSync(source)) {
    console.warn(`[copy-resvg-font] Source font not found: ${source}`);
    return;
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(source, dest);
  console.log(`[copy-resvg-font] Copied ${source} -> ${dest}`);
}

main();

