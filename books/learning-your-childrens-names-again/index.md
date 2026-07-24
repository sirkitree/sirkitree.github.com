---
layout: page
title: Learning Your Children's Names Again
permalink: /books/learning-your-childrens-names-again/
page_class: book-landing-page
---

<section class="book-hero">
  <div class="book-hero__text">
    <p class="book-eyebrow">A memoir by Jerad Bitner</p>
    <h1>Learning Your Children's Names Again</h1>
    <p class="book-subtitle">A true story of love through medical crisis, family resilience, and the miracles in between.</p>
    <div class="book-actions" aria-label="Book actions">
      <a class="btn btn-primary" href="https://www.amazon.com/dp/B0FPB63T63">Buy Paperback</a>
      <a class="btn btn-primary book-actions__secondary-buy" href="https://www.amazon.com/dp/B0FNPS91C2">Kindle eBook</a>
      <a class="btn secondary" href="/books/learning-your-childrens-names-again/preview">Read Preview</a>
    </div>
    <p class="book-note">Based on the Jenney Journals, written during the first days of diagnosis, surgery, and recovery.</p>
  </div>
  <div class="book-hero__visual">
    <div class="book-cover-mockup">
      <img loading="lazy" decoding="async" src="/assets/books/learning-your-childrens-names-again/cover-3d.jpg" alt="Learning Your Children's Names Again book cover">
    </div>
  </div>
</section>

<section class="book-section book-about">
  <div>
    <p class="book-eyebrow">About the book</p>
    <h2>A family's ordinary life, interrupted.</h2>
  </div>
  <div>
    <p>
      When a sudden diagnosis turns a family upside down, a husband's journal becomes a testament to hope. This memoir follows the journey through brain surgery and recovery, and the extraordinary season of relearning everything, including names.
    </p>
    <p>
      It is a story about fear, faith, medicine, community, and the strange mercy of noticing small miracles while life is still coming apart.
    </p>
  </div>
</section>

<section class="book-section book-journals">
  <div class="book-section__header">
    <p class="book-eyebrow">From the journals</p>
    <h2>The entries that started it</h2>
    <p>These are the journal entries that inspired the book.</p>
  </div>
  {% assign jenney_by_category = site.posts | where_exp: "post", "post.category contains 'jenney'" %}
  {% assign jenney_by_tag = site.posts | where_exp: "post", "post.tags contains 'jenney'" %}
  {% assign jenney_posts = jenney_by_category | concat: jenney_by_tag %}
  {% assign jenney_posts = jenney_posts | uniq | sort: 'date'  | slice: 0, 3 %}
  <div class="journal-grid">
    {% for post in jenney_posts %}
      <article class="journal-card">
        <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
        <p class="meta">{{ post.date | date: "%b %-d, %Y" }}</p>
        <p>{{ post.excerpt | strip_html | truncate: 140 }}</p>
      </article>
    {% endfor %}
  </div>
  <p class="book-more-link"><a class="inline" href="/archive">More from the journals →</a></p>
</section>

<section class="book-section book-highlights">
  <div class="book-section__header">
    <p class="book-eyebrow">Inside</p>
    <h2>What you'll find inside</h2>
  </div>
  <div class="book-feature-grid">
    <article>
      <h3>Medical crisis up close</h3>
      <p>The hospital rooms, the waiting, the questions, and the decisions no family is ready to make.</p>
    </article>
    <article>
      <h3>Family resilience</h3>
      <p>The work of caring for children, leaning on community, and learning how to keep going.</p>
    </article>
    <article>
      <h3>Faith under pressure</h3>
      <p>Moments of fear, fierce hope, and the miracles that looked ordinary until they didn't.</p>
    </article>
  </div>
</section>

<section class="book-section book-author">
  <img loading="lazy" decoding="async" src="/assets/books/learning-your-childrens-names-again/author-headshot.jpg" alt="Jerad Bitner">
  <div>
    <p class="book-eyebrow">About the author</p>
    <h2>Jerad Bitner</h2>
    <p>Jerad lives in Gig Harbor, Washington with his wife Jenney and their four children. He wrote this book from the middle of a season that changed their family, their faith, and the way they understand recovery.</p>
  </div>
</section>

<section class="book-section book-newsletter">
  <div class="book-section__header">
    <p class="book-eyebrow">Stay connected</p>
    <h2>Get book updates</h2>
    <p>Get updates on the book release, author events, and exclusive content.</p>
  </div>
  <script async data-uid="f5ff9be78a" src="https://sirkitree.kit.com/f5ff9be78a/index.js"></script>
</section>

<section class="book-cta">
  <p class="book-eyebrow">Available now</p>
  <h2>Read the story behind the journals.</h2>
  <div class="book-actions">
    <a class="btn btn-primary" href="https://www.amazon.com/dp/B0FPB63T63">Buy Paperback</a>
    <a class="btn btn-primary book-actions__secondary-buy" href="https://www.amazon.com/dp/B0FNPS91C2">Kindle eBook</a>
    <a class="btn secondary" href="/books/learning-your-childrens-names-again/preview">Read the First Chapter</a>
  </div>
  <a class="btn secondary" href="/books/learning-your-childrens-names-again/press-kit">Press Kit</a>
  <a class="btn secondary" href="/books/">Back to Books</a>
</section>
