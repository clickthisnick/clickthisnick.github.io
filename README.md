# clickthisnick.com

Personal site for Nick Smith. GitHub Pages serves these files from `master` at `www.clickthisnick.com` (see `CNAME`). `.nojekyll` keeps Pages from running Jekyll.

## Check

```bash
npm ci
npm run check
```

That runs the page tests, HTML validation, the link check, and the size budget. It does not publish the site.

## Domain

`https://www.clickthisnick.com` is the working site. Its certificate is issued for `www.clickthisnick.com` only.

`https://clickthisnick.com` fails the TLS name check until the apex A records point at the current Pages addresses (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`). Keep `CNAME` set to `www.clickthisnick.com`.
