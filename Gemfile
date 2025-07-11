source "https://rubygems.org"

# Jekyll version - use version compatible with GitHub Pages
gem "jekyll", "~> 4.3.0"

# Default theme
gem "minima", "~> 2.5"

# Required for Ruby 3.4+ compatibility
gem "csv"
gem "logger"
gem "base64"

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.15"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end

# Windows and JRuby support
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Web server
gem "webrick", "~> 1.7"
