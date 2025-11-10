// scripts/make-404.js
import { existsSync, copyFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const candidates = ["../build/client/index.html", "../build/index.html"].map(
  (p) => new URL(p, import.meta.url).pathname,
);

const targets = ["../build/client/404.html", "../build/404.html"].map(
  (p) => new URL(p, import.meta.url).pathname,
);

const src = candidates.find(existsSync);
if (!src) {
  console.error("❌ Could not find index.html to copy for 404.html");
  process.exit(0); // don't fail the build
}

for (const dest of targets) {
  try {
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
  } catch {
    // ignore; we only need one of them to succeed
  }
}
console.log("✅ 404.html created for SPA deep-links");
