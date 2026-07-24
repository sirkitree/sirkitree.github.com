// Generates a stub page per tag at tags/<slug>.html so every tag gets a real,
// server-rendered URL at /tags/<slug>/.
//
// GitHub Pages only runs whitelisted plugins, so a Jekyll generator is not an
// option — the stubs have to exist as files. Each one is three lines of front
// matter; _layouts/tag.html does the actual work.
//
// Run after adding a post with a new tag:
//   node scripts/generate_tag_pages.js
//
// Stubs for tags that no longer appear on any post are removed.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, '_posts');
const TAGS_DIR = path.join(ROOT, 'tags');

// Files in tags/ that are hand-maintained, not generated stubs.
const RESERVED = new Set(['index.html', 'tag.html']);

// Mirrors Jekyll's `slugify` filter for the values actually used as tags here.
function slugify(tag) {
  return String(tag).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function frontMatter(source) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

// Posts use two styles: `tags: [a, b]` and a block list of `  - a` lines.
function extractTags(fm) {
  const line = fm.match(/^tags\s*:(.*)$/m);
  if (!line) return [];

  const inline = line[1].trim();
  if (inline.startsWith('[')) {
    return inline.replace(/^\[|\]$/g, '')
      .split(',')
      .map(t => t.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  if (inline && inline !== '') {
    return [inline.replace(/^["']|["']$/g, '')];
  }

  // Block list: take `  - value` lines until a line that isn't indented.
  const rest = fm.slice(line.index + line[0].length).split(/\r?\n/);
  const out = [];
  for (const l of rest) {
    const item = l.match(/^\s+-\s+(.*)$/);
    if (item) { out.push(item[1].trim().replace(/^["']|["']$/g, '')); continue; }
    if (l.trim() === '') continue;
    break;
  }
  return out.filter(Boolean);
}

const tags = new Map(); // slug -> original tag text
for (const file of fs.readdirSync(POSTS_DIR)) {
  if (!/\.(md|markdown|html)$/.test(file)) continue;
  const fm = frontMatter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
  for (const tag of extractTags(fm)) {
    const slug = slugify(tag);
    if (slug && !tags.has(slug)) tags.set(slug, tag);
  }
}

fs.mkdirSync(TAGS_DIR, { recursive: true });

let written = 0;
for (const [slug, tag] of [...tags].sort()) {
  const body = `---
layout: tag
tag: "${tag.replace(/"/g, '\\"')}"
title: "Posts tagged ${tag.replace(/"/g, '\\"')}"
permalink: /tags/${slug}/
---
`;
  const dest = path.join(TAGS_DIR, `${slug}.html`);
  const existing = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
  if (existing !== body) { fs.writeFileSync(dest, body); written++; }
}

let removed = 0;
for (const file of fs.readdirSync(TAGS_DIR)) {
  if (RESERVED.has(file) || !file.endsWith('.html')) continue;
  if (!tags.has(file.replace(/\.html$/, ''))) {
    fs.unlinkSync(path.join(TAGS_DIR, file));
    removed++;
  }
}

console.log(`${tags.size} tags; ${written} stub(s) written, ${removed} stale stub(s) removed.`);
