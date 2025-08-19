---
layout: page
title: Learning Your Children's Names Again
permalink: /books/learning-your-childrens-names-again/
---

<section class="hero">
  <div class="hero-text">
    <p class="sub">A true story of love through medical crisis, family resilience, and the miracles in between.</p>
    <p>
      <a class="btn" href="/books/learning-your-childrens-names-again/preview">Read Preview</a>
      <a class="btn secondary" href="/books/learning-your-childrens-names-again/press-kit">Press Kit</a>
      <a class="btn secondary" href="https://lycna.jeradbitner.com">Newsletter</a>
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
  <p>These are the journal entries that inspired the book.</p>
  {% assign jenney_by_category = site.posts | where_exp: "post", "post.category contains 'jenney'" %}
  {% assign jenney_by_tag = site.posts | where_exp: "post", "post.tags contains 'jenney'" %}
  {% assign jenney_posts = jenney_by_category | concat: jenney_by_tag %}
  {% assign jenney_posts = jenney_posts | uniq | sort: 'date'  | slice: 0, 6 %}
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


<section class="newsletter">
  <h2>Stay Connected</h2>
  <p>Get updates on the book release, author events, and exclusive content.</p>
  <script async data-uid="f5ff9be78a" src="https://sirkitree.kit.com/f5ff9be78a/index.js"></script>
</section>

<section class="cta">
  <a class="btn btn-primary" href="/books/learning-your-childrens-names-again/preview">Read the First Chapter</a>
  <a class="btn secondary" href="/books/learning-your-childrens-names-again/press-kit">Press Kit</a>
  <a class="btn secondary" href="/books/">Back to Books</a>
  
</section>

<script type="module" src="/assets/js/three-book.js"></script>


