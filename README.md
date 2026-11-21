# clickthisnick.com

Personal site for Nick Smith. GitHub Pages builds it with Jekyll from the `master` branch and serves it at `www.clickthisnick.com` (see `CNAME`).

## Requirements

- Ruby 3.2 or 3.3, plus Bundler
- Node.js 22
- Python 3, for codespell (`pip install -r requirements-dev.txt` if it is not installed)

## Run locally

```bash
bundle install
bundle exec jekyll serve
```

Open http://127.0.0.1:4000

Restart the server after editing `_config.yml`. Jekyll does not reload that file on its own.

## Tests

```bash
npm ci
bundle install
npm run check
```

That is the same command GitHub Actions runs on push and pull request. It does not replace the GitHub Pages publish step. `AGENTS.md` lists what the command covers.

## Styles

`style.min.css` is the stylesheet the site serves. GitHub Pages does not compile Sass, so that file stays committed. Sources are in `styles/`.

```bash
npm run build:css
```

## Domain and HTTPS

`https://www.clickthisnick.com` is the working site. Its certificate is issued for `www.clickthisnick.com` only.

`https://clickthisnick.com` fails the TLS name check. The apex A records are `192.30.252.153` and `192.30.252.154`. Those addresses used to be GitHub Pages and now present a `*.github.com` certificate. `www` is a CNAME to `clickthisnick.github.io`, which resolves to the current Pages addresses (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).

Keep `CNAME` set to `www.clickthisnick.com`. That is the hostname Pages has approved. Generated links in the feed and canonical tags use `https://www.clickthisnick.com`.

HTTP requests to the apex already redirect to www. HTTPS on the apex can succeed only after DNS sends that name to GitHub Pages. At the DNS host, replace the apex A records with:

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

After those records propagate, confirm the certificate's subject alternative names include `clickthisnick.com`. Pages can issue that name on the next certificate only when the validation request reaches Pages.
