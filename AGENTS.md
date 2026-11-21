# Agent notes

Personal Jekyll site for www.clickthisnick.com. GitHub Pages builds `master` with the `github-pages` gem. `CNAME` stays `www.clickthisnick.com`.

## Before finishing

```bash
npm ci
bundle install
npm run check
```

`npm run check` is the only CI check. It formats nothing; it fails when prettier, eslint, `tsc --noEmit`, stylelint, codespell, actionlint, the Sass compile, the Jekyll build, html-validate, the link check, the Ruby tests, the JS tests, the coverage floor, or the size budget fail.

Rebuild `style.min.css` with `npm run build:css` after changing `styles/`. Commit that file. Pages does not compile Sass. `lib/css/bootswatch.css` is the Bootstrap subset these pages use. `size-budget.json` allows the built `_site` size plus 8 KiB.

## Rules

- Keep it simple, with no new build step.
- Don't add a dependency without a stated reason.
- Keep archived content (`resources/`, including older resumes and `resources/404.jpg`).
- Every bug fix gets a test.
- Never lower the coverage floor (`--test-coverage-lines`, `--test-coverage-functions`, and `--test-coverage-branches` in `script/check`) or the size budget (`size-budget.json`).
- Don't make visible UI changes unless asked.
- Keep existing URLs working, including `/`, `/blog/`, `/projects/`, `/contact/`, `/recruiters/`, `/hyREOVPtbabaoyLOQbqaserONMvsRMlt/`, `/foo.html`, `/404.html`, `/feed.xml`, and post permalinks.

## CI

`.github/workflows/ci.yml` runs on push and pull_request with `contents: read`. It checks out the repo, installs Ruby 3.3 and Node 22, runs `npm ci`, then `npm run check`. It does not deploy. GitHub Pages still publishes `master`.

Fast checks also run from the lefthook pre-commit hook (`lefthook.yml`). That hook is not a substitute for `npm run check`.
