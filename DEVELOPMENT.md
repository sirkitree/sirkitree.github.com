# Developer Guide

This document provides an overview of the project structure, dependencies, and workflows for developing, building, and deploying the site.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Directory Structure](#directory-structure)
- [Running the Site Locally](#running-the-site-locally)
- [Building and Deploying](#building-and-deploying)
- [Adding Content](#adding-content)
- [Scripts](#scripts)
- [Customization](#customization)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- **Ruby** (>= 2.5) and Bundler
- **Node.js** (>= 14) and npm
- **Python** (>= 3.6) and pip
- A modern web browser for testing

## Setup

```bash
# Clone the repository
git clone git@github.com:sirkitree/sirkitree.github.com.git
cd sirkitree.github.com

# Install Ruby dependencies
bundle install

# Install Node.js dependencies
npm install

# (Optional) Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install beautifulsoup4
```

## Directory Structure

- `_posts/`            : Blog post Markdown files
- `_layouts/`          : Jekyll layouts
- `_includes/`         : Jekyll includes
- `css/`, `js/`        : Stylesheets and JavaScript files
- `assets/`            : Static assets (images, thumbnails, etc.)
- `scripts/`           : Utility scripts for automation
- `ng-views/`          : AngularJS partial views
- `tags/`              : Tag listing pages
- `websim-projects/`   : Archived WebSim.ai project HTML files
- `archive/`, `angular-google-auth/`, `beckbits/`, `hublog-ng/`: Standalone pages and subprojects
- `Gemfile`, `package.json`, `_config.yml`, `CNAME` : Configuration and dependency files
- `_site/`             : Generated site (ignored by version control)

## Running the Site Locally

Start the Jekyll development server and watch for changes:

```bash
bundle exec jekyll serve
```

Open <http://localhost:4000> in your browser.

## Building and Deploying

Build the static site into the `_site/` directory:

```bash
bundle exec jekyll build
```

Deployment to GitHub Pages is automatic when you push to the default branch. The `CNAME` file configures the custom domain.

## Adding Content

### Blog Posts

See the [README](README.md) for quick instructions on creating new blog posts.

### Static Pages

To add a standalone page, create an HTML or Markdown file at the project root (or in a subdirectory). If you want to apply Jekyll layouts or Liquid templating, include YAML front matter at the top of the file:

```yaml
---
layout: page
title: "My New Page"
permalink: /my-new-page/
---
```

## Scripts

Several utility scripts help automate common tasks:

| Script                            | Description                                                       |
| --------------------------------- | ----------------------------------------------------------------- |
| `scripts/generate_thumbnails.js`  | Generate PNG thumbnails for WebSim projects using Puppeteer       |
| `scripts/rename_websim_files.py`  | Slugify and rename HTML files in `websim-projects/`               |
| `scripts/websim_to_blog.py`       | Import WebSim.ai projects into blog posts under `_posts/`         |

Usage examples:

```bash
# Generate thumbnails (requires Node.js dependencies)
node scripts/generate_thumbnails.js

# Slugify and rename WebSim HTML files (requires BeautifulSoup4)
python scripts/rename_websim_files.py

# Import WebSim.ai projects as blog posts
python scripts/websim_to_blog.py
```

## Customization

- **Layouts**   : `_layouts/` (`default.html`, `post.html`, `page.html`, `tag.html`, etc.)
- **Includes**  : `_includes/`
- **Styles**    : `css/` (update `main.css`, `normalize.css`, `syntax.css`)
- **AngularJS** : Partial views in `ng-views/`

## Dependencies

- **Ruby Gems:** `jekyll`, `jekyll-gist`, `jekyll-paginate`
- **Node Modules:** `puppeteer`, `serve-handler`
- **Python Packages:** `beautifulsoup4`

## Contributing

Contributions and pull requests are welcome. To contribute:

1. Fork the repository and create a feature branch.
2. Make your changes and write clear commit messages.
3. Ensure the site builds and renders correctly locally.
4. Open a pull request for review.

## Troubleshooting

- If Jekyll fails to serve, ensure your Ruby and Bundler versions meet the prerequisites.
- Remove or clean the `_site/` directory if stale files cause conflicts.
- If thumbnail generation fails, verify your Node.js and Puppeteer installation.