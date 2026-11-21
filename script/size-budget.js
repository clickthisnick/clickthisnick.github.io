"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const site = path.join(root, "_site");
const budgetPath = path.join(root, "size-budget.json");

/**
 * @param {string} dir
 * @returns {number}
 */
function bytesIn(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += bytesIn(full);
    } else if (entry.isFile()) {
      total += fs.statSync(full).size;
    }
  }
  return total;
}

const budget = JSON.parse(fs.readFileSync(budgetPath, "utf8"));
const actual = bytesIn(site);
const maxBytes = budget.maxBytes;
console.log("shipped site " + actual + " bytes; budget " + maxBytes + " bytes");
if (typeof maxBytes !== "number" || actual > maxBytes) {
  console.error("The built site is larger than size-budget.json allows.");
  process.exit(1);
}
