# Agent notes

Static site for www.clickthisnick.com. GitHub Pages serves this repo as files. `.nojekyll` is required. `CNAME` stays `www.clickthisnick.com`. There is no build step.

## Before finishing

```bash
npm ci
npm run check
```

`npm run check` is the only CI check. It runs the page tests, html-validate, the link check, and the size budget.

## Rules

- Keep it simple. One stylesheet, `style.css`. Duplicate the header and footer in each page rather than adding a build tool.
- Don't add a dependency without a stated reason. html-validate checks markup. linkinator checks links.
- No JavaScript unless that page already needs it (the recruiter redirect and the Calendly embed).
- Keep archived content (`resources/`, including older resumes and `resources/404.jpg`).
- Every bug fix gets a test.
- Never raise `size-budget.json` except when a requested change adds files the site must serve. It is the served site size plus 1 KiB.
- Do not request fonts from Google. The used faces are subset WOFF2 files in `fonts/`, with their OFL licenses. News Cycle and Arvo have reserved names, so the subsets are `Body Gothic` and `Title Slab`.
- Don't make visible UI changes unless asked.
- Keep existing URLs working: `/`, `/blog/`, `/projects/`, `/contact/`, `/recruiters/`, `/hyREOVPtbabaoyLOQbqaserONMvsRMlt/`, `/404.html`, `/feed.xml`, `/2017/03/14/Pi-Day.html`. `/foo.html` was removed on purpose.
- `/itinerary/` and `/dynamic-release-checklist/` are GitHub Pages project sites from other repositories. Link to them. Do not add those directories here.

## CI

`.github/workflows/ci.yml` runs on push and pull_request with `contents: read`. It installs Node 22, runs `npm ci`, then `npm run check`. It does not deploy. GitHub Pages publishes the files on `master`.
