# Tech Context

## Core Technologies

- **Jekyll** (Ruby Gem) for static site generation
- **GitHub Pages** for hosting
- **Markdown** for content
- **Liquid** for templating
- **Disqus** for comments
- **Node.js** (with Puppeteer, serve-handler) for automation scripts
- **Python** (with BeautifulSoup4) for automation scripts
- **AngularJS 1.0.7** for subproject demos/experiments
- **Bootstrap 5** for dropdowns and UI components

## Development Setup

- Ruby >= 2.5, Bundler for Jekyll
- Node.js >= 14, npm for scripts
- Python >= 3.6, pip for scripts
- Clone repo, run `bundle install`, `npm install`, and optionally set up Python venv
- Local dev: `bundle exec jekyll serve`

## Constraints

- Must be compatible with GitHub Pages (safe mode, limited plugins)
- Static site only (no server-side code)
- Automation scripts must not interfere with Jekyll build

## Dependencies

- Ruby Gems: jekyll, jekyll-gist, jekyll-paginate
- Node.js: puppeteer, serve-handler
- Python: beautifulsoup4
- Frontend: Bootstrap 5, Google Fonts, custom CSS/JS
- AngularJS and related libraries for subprojects
