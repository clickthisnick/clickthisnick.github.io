source "https://rubygems.org"

# Current github-pages gem (Jekyll 3.10). Pages' versions.json still listed 232
# on 2026-11-21; 233 is the latest pages-gem and only updates plugins this site
# does not render (seo-tag, redirect-from, remote-theme) plus the feed escape fix.
# https://pages.github.com/versions.json
gem "github-pages", "233", group: :jekyll_plugins

# Ruby 3 does not ship webrick, which `jekyll serve` needs.
gem "webrick", "~> 1.8"

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]
