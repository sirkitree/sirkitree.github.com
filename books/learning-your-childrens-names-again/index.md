---
layout: page
title: Learning Your Children's Names Again
permalink: /books/learning-your-childrens-names-again/
---

<section class="hero">
  <div class="hero-text">
    <h1>Learning Your Children's Names Again</h1>
    <p class="sub">A true story of love through medical crisis, family resilience, and the miracles in between.</p>
    <p>
      <a class="btn" href="/books/learning-your-childrens-names-again/preview">Read Preview</a>
      <a class="btn secondary" href="/books/learning-your-childrens-names-again/press-kit">Press Kit</a>
    </p>
  </div>
  <div class="hero-visual">
    <div id="book3d" 
         data-cover-front="/assets/books/learning-your-childrens-names-again/cover-front.jpg"
         data-cover-back="/assets/books/learning-your-childrens-names-again/cover-back.jpg"
         data-cover-spine="/assets/books/learning-your-childrens-names-again/cover-spine.jpg">
      <noscript>
        <img src="/assets/books/learning-your-childrens-names-again/cover-front.jpg" alt="Book cover" />
      </noscript>
    </div>
  </div>
  
</section>

<section class="about">
  <h2>About the Book</h2>
  <p>
    When a sudden diagnosis turns a family upside down, a husband's journal becomes a testament to hope. 
    This memoir follows the journey through brain surgery and recovery, and the extraordinary season of relearning everything—including names.
  </p>
</section>

<section class="journals">
  <h2>From the Journals</h2>
  {% assign jenney_posts = site.posts | reverse %}
  {% assign jenney_posts = jenney_posts | where_exp: "p", "p.category contains 'jenney'" %}
  {% assign jenney_posts = jenney_posts | slice: 0, 6 %}
  <div class="journal-grid">
    {% for post in jenney_posts %}
      <article class="journal-card">
        <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
        <p class="meta">{{ post.date | date: "%b %-d, %Y" }}</p>
        <p>{{ post.excerpt | strip_html | truncate: 140 }}</p>
      </article>
    {% endfor %}
  </div>
  <p><a class="inline" href="/archive">More from the journals →</a></p>
</section>

<section class="highlights">
  <h2>What You'll Find Inside</h2>
  <ul>
    <li>Love meeting medical crisis</li>
    <li>Family resilience and community care</li>
    <li>Moments of faith, fear, and fierce hope</li>
  </ul>
</section>

<section class="cta">
  <a class="btn" href="/books/learning-your-childrens-names-again/preview">Read the First Chapter</a>
  <a class="btn secondary" href="/books/learning-your-childrens-names-again/press-kit">Press Kit</a>
  <a class="btn secondary" href="/book">Back to Books</a>
  
</section>

<script type="module" src="/assets/js/three-book.js"></script>

<style>
.hero { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; align-items: center; margin-bottom: 24px; }
.hero-text .sub { color: var(--muted-color); margin: 8px 0 16px; }
.hero-visual { min-height: 360px; }
#book3d { width: 100%; height: 360px; background: var(--hover-color); border-radius: 8px; overflow: hidden; position: relative; }
.btn { display: inline-block; padding: 8px 12px; border-radius: 6px; background: var(--link-color); color: #fff; text-decoration: none; margin-right: 8px; }
.btn.secondary { background: transparent; color: var(--link-color); border: 1px solid var(--link-color); }
.journals .journal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.journal-card { padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--background-color); }
.journal-card .meta { color: var(--muted-color); font-size: 12px; margin: 6px 0; }
.highlights ul { padding-left: 18px; }
@media (max-width: 900px) { .hero { grid-template-columns: 1fr; } .hero-visual { order: -1; } }
@media (max-width: 640px) { .journals .journal-grid { grid-template-columns: 1fr; } }
</style>


