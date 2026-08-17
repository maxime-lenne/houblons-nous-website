source "https://rubygems.org"

# Core Jekyll
gem "jekyll", "~> 4.3.0"
gem "webrick", "~> 1.8"

# Essential Jekyll Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"           # RSS/Atom feeds
  gem "jekyll-sitemap", "~> 1.4"         # XML sitemap generation
  gem "jekyll-seo-tag", "~> 2.8"         # Meta tags & SEO optimization
  gem "jekyll-paginate", "~> 1.1"        # Blog pagination
  gem "jekyll-compress-images", "~> 1.1" # Image optimization
  gem "jekyll-minifier", "~> 0.1"        # HTML/CSS/JS compression
  gem "jekyll-notion-cms", "~> 1.0.2"    # Notion CMS integration
end

# System gems for Ruby 3.3.5 compatibility
gem "logger"
gem "csv"
gem "ostruct"
gem "base64"

# Windows and JRuby compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
