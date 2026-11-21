"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { createRecruiterController } = require("../_includes/recruiter-form.js");

/**
 * @returns {{ controller: ReturnType<typeof createRecruiterController>, log: string[], runScheduled: () => void }}
 */
function harness() {
  /** @type {string[]} */
  const log = [];
  /** @type {() => void} */
  let scheduled = function () {};
  const controller = createRecruiterController({
    nextUrl: "/hyREOVPtbabaoyLOQbqaserONMvsRMlt/",
    say: function (message) {
      log.push("say:" + message);
    },
    assign: function (url) {
      log.push("assign:" + url);
    },
    schedule: function (fn, delay) {
      log.push("schedule:" + String(delay));
      scheduled = fn;
    },
  });
  return {
    controller: controller,
    log: log,
    runScheduled: function () {
      scheduled();
    },
  };
}

test("invalid submit tells the visitor to finish the form", function () {
  const run = harness();
  run.controller.onInvalid();
  assert.deepEqual(run.log, [
    "say:Please complete the required fields before submitting.",
  ]);
});

test("submit announces sending and schedules one redirect", function () {
  const run = harness();
  run.controller.onSubmit();
  assert.deepEqual(run.log, ["say:Sending your information.", "schedule:1500"]);
  run.runScheduled();
  assert.deepEqual(run.log, [
    "say:Sending your information.",
    "schedule:1500",
    "say:Information sent. Opening the next step.",
    "assign:/hyREOVPtbabaoyLOQbqaserONMvsRMlt/",
  ]);
});

test("a frame load before submit does not redirect", function () {
  const run = harness();
  run.controller.onFrameLoad();
  assert.deepEqual(run.log, []);
});

test("the frame and the timer redirect only once", function () {
  const run = harness();
  run.controller.onSubmit();
  run.controller.onFrameLoad();
  run.runScheduled();
  const assigns = run.log.filter(function (entry) {
    return entry.startsWith("assign:");
  });
  assert.deepEqual(assigns, ["assign:/hyREOVPtbabaoyLOQbqaserONMvsRMlt/"]);
});
