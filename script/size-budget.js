"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const budgetPath = path.join(root, "size-budget.json");
const skipDir = new Set([
  ".git",
  "node_modules",
  "vendor",
  ".cache",
  "_site",
  "test",
  "script",
  ".github",
]);
const skipFile = new Set([
  "package.json",
  "package-lock.json",
  "AGENTS.md",
  "README.md",
  "size-budget.json",
]);

/**
 * @param {string} dir
 * @returns {number}
 */
function bytesIn(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDir.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += bytesIn(full);
    } else if (entry.isFile()) {
      if (dir === root && skipFile.has(entry.name)) continue;
      if (entry.name.startsWith(".") && entry.name !== ".nojekyll") continue;
      total += fs.statSync(full).size;
    }
  }
  return total;
}

const budget = JSON.parse(fs.readFileSync(budgetPath, "utf8"));
const actual = bytesIn(root);
console.log("served site " + actual + " bytes; budget " + budget.maxBytes + " bytes");
if (typeof budget.maxBytes !== "number" || actual > budget.maxBytes) {
  console.error("The site is larger than size-budget.json allows.");
  process.exit(1);
}
