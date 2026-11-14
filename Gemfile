source "https://rubygems.org"

# Pin the same gem GitHub Pages uses for the legacy build (Jekyll 3.10.x).
# https://pages.github.com/versions.json
gem "github-pages", group: :jekyll_plugins

# Ruby 3 does not ship webrick, which `jekyll serve` needs.
gem "webrick", "~> 1.8"

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]
