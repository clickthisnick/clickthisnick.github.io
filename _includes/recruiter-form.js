/**
 * @typedef {object} RecruiterControllerOptions
 * @property {string} nextUrl
 * @property {(message: string) => void} say
 * @property {(url: string) => void} assign
 * @property {(fn: () => void, delay: number) => void} schedule
 */

/**
 * @typedef {object} RecruiterController
 * @property {() => void} onInvalid
 * @property {() => void} onSubmit
 * @property {() => void} onFrameLoad
 */

/**
 * Redirects the recruiter form once, whether the hidden frame loads or the
 * fallback timer fires first.
 * @param {RecruiterControllerOptions} options
 * @returns {RecruiterController}
 */
function createRecruiterController(options) {
  var moved = false;
  var started = false;

  function go() {
    if (moved) {
      return;
    }
    moved = true;
    options.say("Information sent. Opening the next step.");
    options.assign(options.nextUrl);
  }

  return {
    onInvalid: function () {
      options.say("Please complete the required fields before submitting.");
    },
    onSubmit: function () {
      started = true;
      options.say("Sending your information.");
      options.schedule(go, 1500);
    },
    onFrameLoad: function () {
      if (started) {
        go();
      }
    },
  };
}

if (typeof module === "object" && module.exports) {
  module.exports = { createRecruiterController: createRecruiterController };
}
