---
layout: page
title: Books
permalink: /book/
---

<section class="books-intro">
  <p>Explore current and upcoming works.</p>
</section>

<section class="books-grid">
  <article class="book-card">
    <div class="book-cover">
      <img src="/assets/books/learning-your-childrens-names-again/cover-front.jpg" alt="Learning Your Children's Names Again cover">
    </div>
    <div class="book-meta">
      <h2>Learning Your Children's Names Again</h2>
      <p class="tagline">A family's journey through a wife's brain surgery, recovery, and relearning everything — including names.</p>
      <p>
        <a class="btn btn-primary" href="/books/learning-your-childrens-names-again/">View Book</a>
        <a class="btn secondary" href="/books/learning-your-childrens-names-again/preview">Read Preview</a>
      </p>
    </div>
  </article>
</section>

<style>
.books-grid { display: grid; gap: 24px; }
.book-card { display: grid; grid-template-columns: 140px 1fr; gap: 16px; align-items: center; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--background-color); }
.book-cover { position: relative; width: 140px; aspect-ratio: 2/3; border-radius: 6px; overflow: hidden; background: var(--hover-color); display: grid; place-items: center; color: var(--muted-color); font-size: 12px; }
.book-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.book-cover .cover-fallback { position: absolute; inset: 0; display: grid; place-items: center; opacity: .7; padding: 8px; text-align: center; }
.book-meta h2 { margin: 0 0 8px; }
.book-meta .tagline { margin: 0 0 12px; color: var(--muted-color); }
.btn { display: inline-block; padding: 8px 12px; border-radius: 6px; background: var(--link-color); color: #fff; text-decoration: none; margin-right: 8px; }
.btn.secondary { background: transparent; color: var(--link-color); border: 1px solid var(--link-color); }
@media (max-width: 640px) { .book-card { grid-template-columns: 1fr; } .book-cover { width: 100%; } }
</style>


