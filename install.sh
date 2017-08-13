#!/bin/bash

brew install ruby
gem install bundler
bundle install --path ~/.gem
bundle exec jekyll serve --watch
npm run compile-css-watch
