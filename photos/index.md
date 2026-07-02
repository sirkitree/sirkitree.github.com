---
layout: page
title: Photography
permalink: /photos/
---

Colorado, the Pacific Northwest, and wherever else I end up pointing a camera.

{% assign thumbs = site.static_files | where_exp: "f", "f.path contains 'assets/photos/thumbs'" | sort: "path" | reverse %}

{% if thumbs.size == 0 %}
<p><em>Nothing here yet — photos are on their way.</em></p>
{% else %}
<div class="photo-grid" id="photo-grid">
{% for t in thumbs %}
  {% assign fname = t.path | split: "/" | last %}
  {% assign alt = fname | replace: ".jpg", "" | replace: "-", " " %}
  <a href="/assets/photos/full/{{ fname }}" class="photo-item">
    <img src="{{ t.path }}" alt="{{ alt }}" loading="lazy">
  </a>
{% endfor %}
</div>
{% endif %}

<div class="photo-lightbox" id="photo-lightbox" hidden>
  <button class="photo-lightbox-close" aria-label="Close">&times;</button>
  <button class="photo-lightbox-prev" aria-label="Previous photo">&#8249;</button>
  <img class="photo-lightbox-img" alt="">
  <button class="photo-lightbox-next" aria-label="Next photo">&#8250;</button>
</div>

<style>
.photo-grid {
  columns: 3 280px;
  column-gap: 1rem;
  padding: 1rem 0;
}

.photo-item {
  display: block;
  margin-bottom: 1rem;
  break-inside: avoid;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s ease-in-out;
}

.photo-item:hover {
  transform: translateY(-3px);
}

.photo-item img {
  display: block;
  width: 100%;
  height: auto;
}

.photo-lightbox[hidden] {
  display: none;
}

.photo-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
}

.photo-lightbox-img {
  max-width: 92vw;
  max-height: 92vh;
  border-radius: 4px;
}

.photo-lightbox button {
  position: absolute;
  background: none;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.5rem 1rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.photo-lightbox button:hover {
  opacity: 1;
}

.photo-lightbox-close { top: 1rem; right: 1rem; }
.photo-lightbox-prev  { left: 0.5rem; top: 50%; transform: translateY(-50%); }
.photo-lightbox-next  { right: 0.5rem; top: 50%; transform: translateY(-50%); }
</style>

<script>
(function() {
  'use strict';

  const grid = document.getElementById('photo-grid');
  const lightbox = document.getElementById('photo-lightbox');
  if (!grid || !lightbox) return;

  // Re-parent to <body>: a transformed ancestor (e.g. the page fade-in)
  // would otherwise become the containing block for position: fixed.
  document.body.appendChild(lightbox);

  const items = Array.from(grid.querySelectorAll('.photo-item'));
  const img = lightbox.querySelector('.photo-lightbox-img');
  let current = -1;

  function show(index) {
    current = (index + items.length) % items.length;
    img.src = items[current].href;
    img.alt = items[current].querySelector('img').alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
    });
  });

  lightbox.querySelector('.photo-lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.photo-lightbox-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.photo-lightbox-next').addEventListener('click', () => show(current + 1));

  // Click on the backdrop (not the image or buttons) closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
</script>
