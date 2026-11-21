"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");

function read(rel) {
  const full = path.join(root, rel);
  assert.ok(fs.existsSync(full), "missing " + rel);
  return fs.readFileSync(full, "utf8");
}

function links(html, from) {
  const found = [];
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    const target = url.split("#", 1)[0].split("?", 1)[0];
    if (!target || /^(?:mailto:|https?:|data:|\/\/)/.test(target)) continue;
    const full = target.startsWith("/")
      ? path.join(root, target.slice(1))
      : path.resolve(path.dirname(from), target);
    found.push({ url, full });
  }
  return found;
}

test("pages do not call Google Fonts", function () {
  const files = ["style.css", "index.html", "projects/index.html"];
  for (const file of files) {
    const text = read(file);
    assert.equal(text.includes("fonts.googleapis.com"), false, file);
    assert.equal(text.includes("fonts.gstatic.com"), false, file);
  }
  for (const face of ["body-gothic-400.woff2", "body-gothic-700.woff2", "title-slab-400.woff2"]) {
    assert.ok(fs.existsSync(path.join(root, "fonts", face)), face);
  }
  for (const gone of ["poppins-400.woff2", "poppins-600.woff2", "poppins-700.woff2", "OFL-poppins.txt"]) {
    assert.equal(fs.existsSync(path.join(root, "fonts", gone)), false, gone);
  }
});

test("cname and nojekyll stay in place", function () {
  assert.equal(read("CNAME").trim(), "www.clickthisnick.com");
  assert.ok(fs.existsSync(path.join(root, ".nojekyll")));
  for (const gone of ["_config.yml", "Gemfile", "Gemfile.lock", "_layouts", "_includes", "_posts"]) {
    assert.equal(fs.existsSync(path.join(root, gone)), false, gone);
  }
});

test("pages keep their urls, names, and one stylesheet", function () {
  const pages = {
    "index.html": ["Home", "https://www.clickthisnick.com/", "I Know Software"],
    "blog/index.html": ["Blog", "https://www.clickthisnick.com/blog/", "Happy Pi Day"],
    "projects/index.html": ["Projects", "https://www.clickthisnick.com/projects/", "Real World Problems"],
    "contact/index.html": ["Contact", "https://www.clickthisnick.com/contact/", "admin@clickthisnick.com"],
    "recruiters/index.html": ["Recruiter", "https://www.clickthisnick.com/recruiters/", "recruiter-form"],
    "hyREOVPtbabaoyLOQbqaserONMvsRMlt/index.html": ["Next Steps", "/resources/Nicholas.Smith.Resume.pdf", "calendly.com/clickthisnick"],
    "2017/03/14/Pi-Day.html": ["Happy Pi Day", "https://www.clickthisnick.com/2017/03/14/Pi-Day.html", "Back To Blog"],
    "404.html": ["Page not found", 'id="back-home" href="/"', "Page not found"],
  };
  assert.equal(fs.existsSync(path.join(root, "foo.html")), false);
  for (const [file, bits] of Object.entries(pages)) {
    const html = read(file);
    for (const bit of bits) assert.ok(html.includes(bit), file + " missing " + bit);
    assert.equal(html.includes("/style.min.css"), false, file);
    assert.equal(html.includes("/lib/css/bootswatch.css"), false, file);
    assert.ok(html.includes('href="/style.css"'), file);
  }
  const home = read("index.html");
  assert.ok(home.includes('id="nav-home" href="/" aria-current="page"'));
  assert.ok(home.includes('href="/blog"'));
  assert.ok(home.includes('href="/projects"'));
  assert.ok(home.includes('href="/contact"'));
  assert.ok(read("blog/index.html").includes("/2017/03/14/Pi-Day.html"));
  assert.ok(read("2017/03/14/Pi-Day.html").includes('href="/blog"'));
});

test("project apps and local files resolve", function () {
  const projects = read("projects/index.html");
  assert.ok(projects.includes('href="/dynamic-release-checklist/"'));
  assert.ok(projects.includes('href="/itinerary/">Itinerary</a>'));
  assert.equal(projects.includes("Intinerary"), false);
  assert.equal(projects.match(/\/resources\/projects\//g).length, 6);
  const htmlFiles = [
    "index.html",
    "blog/index.html",
    "projects/index.html",
    "contact/index.html",
    "recruiters/index.html",
    "hyREOVPtbabaoyLOQbqaserONMvsRMlt/index.html",
    "2017/03/14/Pi-Day.html",
    "404.html",
  ];
  const hostedApps = new Set(["/itinerary/", "/dynamic-release-checklist/"]);
  for (const file of htmlFiles) {
    const full = path.join(root, file);
    for (const link of links(read(file), full)) {
      if (hostedApps.has(link.url)) continue;
      const index = path.join(link.full, "index.html");
      assert.ok(
        fs.existsSync(link.full) || fs.existsSync(index),
        file + " -> " + link.url,
      );
    }
  }
});

test("recruiter form still posts the known fields", function () {
  const html = read("recruiters/index.html");
  assert.ok(html.includes("formResponse"));
  assert.ok(html.includes('name="emailAddress"'));
  assert.ok(html.includes('name="entry.339553748"'));
  assert.ok(html.includes("window.location.assign"));
  assert.ok(html.includes("/hyREOVPtbabaoyLOQbqaserONMvsRMlt/"));
  const feed = read("feed.xml");
  assert.ok(feed.includes("https://www.clickthisnick.com/"));
  assert.equal(feed.includes("https://clickthisnick.com/"), false);
});
