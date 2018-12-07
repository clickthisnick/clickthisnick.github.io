#!/bin/bash

brew install ruby
gem install bundler
bundle install --path ~/.gem
bundle exec jekyll serve --watch

# If you make css changes or image changes
# You can run scripts in the package.json that will minify
