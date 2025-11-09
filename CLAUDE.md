# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based personal website and blog (sirkitree.github.com) with automated deployment to GitHub Pages. The site features a modern design with dark/light theme toggle, 3D background effects using Three.js, and extensive automation for content management.

## Essential Commands

### Development Server
```bash
bundle exec jekyll serve    # Start development server at localhost:4000
```

### Build and Deploy
```bash
bundle exec jekyll build    # Build static site to _site/
# Deployment is automatic via GitHub Pages on push to master
```

### Setup Commands
```bash
bundle install              # Install Ruby dependencies
npm install                # Install Node.js dependencies
python3 -m venv venv && source venv/bin/activate && pip install beautifulsoup4
```

### Content Automation Scripts
```bash
node scripts/generate_thumbnails.js     # Generate WebSim project thumbnails
python scripts/rename_websim_files.py   # Slugify WebSim HTML files
python scripts/websim_to_blog.py        # Import WebSim projects as blog posts
```

## Architecture Overview

### Jekyll Structure
- `_posts/`: Blog posts in Markdown with YAML front matter (100+ posts from 2006-2025)
- `_layouts/`: Template files (default.html, post.html, page.html, tag.html, new.html)
- `_config.yml`: Main Jekyll configuration with pagination, kramdown, and timezone settings
- `_site/`: Generated output (never edit directly)

### Content Management
- **WebSim Projects**: `websim-projects/` contains 26+ interactive HTML experiments from WebSim.ai
- **Memory Bank**: `memory-bank/` stores project documentation and context
- **Special Collections**: `beckbits/` (creative projects), `ipe/` (real estate tools), `hublog-ng/` (AngularJS blog interface)

### Frontend Architecture
- **Theme System**: CSS custom properties with localStorage persistence for dark/light mode
- **3D Graphics**: Three.js hexagonal voxel grid background in `js/grid.js`
- **Responsive Design**: Bootstrap integration with custom hamburger menu
- **Tag System**: Organized content categorization with dedicated tag pages

### Automation Pipeline
- **Thumbnail Generation**: Puppeteer-based automation for WebSim project previews
- **Content Import**: Python scripts for batch importing WebSim projects as blog posts
- **File Management**: Automated slugification and renaming of HTML files

## Development Workflow

### Adding Blog Posts
1. Create `_posts/YYYY-MM-DD-title.md` with YAML front matter
2. Test locally with `bundle exec jekyll serve`
3. Commit and push (automatic deployment)

### Working with WebSim Projects
- HTML files in `websim-projects/` are standalone interactive experiments
- Use `generate_thumbnails.js` to create preview images
- Import as blog posts with `websim_to_blog.py`

### Styling and UI
- Main styles in `css/main.css` with dark/light theme variables
- JavaScript modules in `js/` including Three.js components
- Layouts use Liquid templating with conditional logic for different content types

## Key Dependencies

### Ruby (Gemfile)
- `jekyll` (static site generator)
- `jekyll-gist` (GitHub Gist embedding)
- `jekyll-paginate` (pagination support)

### Node.js (package.json)
- `puppeteer` (headless browser for thumbnails)
- `serve-handler` (local development server)

### Python (scripts)
- `beautifulsoup4` (HTML parsing for content import)

## Special Features

### Jenney Journals
Special category of personal journal entries with dropdown navigation and custom styling.

### Interactive Background
Three.js-powered hexagonal voxel grid with ambient lighting that responds to theme changes.

### GitHub Pages Integration
- Custom domain configured via `CNAME`
- Automatic deployment on push to master branch
- Jekyll plugins limited to GitHub Pages whitelist

## File Patterns

- Blog posts: `_posts/YYYY-MM-DD-title.md`
- WebSim projects: `websim-projects/descriptive-filename.html`
- Thumbnails: `assets/websim-thumbnails/filename.png`
- Tag pages: `tags/tagname.html`
- add <br> tags at the end of each line when publishing poetry to ensure the line breaks render correctly in Markdown. This is important
  for maintaining the poetic structure and formatting.