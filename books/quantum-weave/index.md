---
layout: page
title: Quantum Weave
permalink: /books/quantum-weave/
---

<section class="hero">
  <div class="hero-text">
    <h1>Quantum Weave</h1>
    <p class="sub">A science-fantasy novel where magic is forgotten nanotechnology, and reality itself refuses to stay singular.</p>
    <p>
      <a class="btn primary" href="#newsletter">Get Updates</a>
      <a class="btn" href="/tags/tag/?tag=quantum-weave">Read Narratives</a>
    </p>
  </div>
  <div class="hero-image">
    <img src="/assets/books/quantum-weave/threads-hand.png" alt="A hand with glowing quantum threads - representing the nanotechnology that Weavers believe is magic" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 255, 255, 0.2);">
  </div>
</section>

<section class="about">
  <h2>About the World</h2>
  <p>
    In a world where magic is real but its true nature forgotten, 5% of the population are born with "threads"—what they believe to be mystical power, but which is actually inherited nanotechnology from a collapsed civilization. These Weavers manipulate the quantum electromagnetic field through precise gestures, tonal commands, and mental focus, never knowing they're interfacing with ancient machines in their own bloodstream.
  </p>
  <p>
    But in places where spells fail catastrophically, reality breaks. Corrupted Weave Zones emerge—places where the quantum field can't decide what's real. Where a meadow both exists and doesn't. Where time branches into probability. Where a deer can be trapped forever in the threshold between states.
  </p>
  <p>
    This is the story of those who seek to understand permanence, those who guard ancient knowledge, and those caught in the spaces between truth and impossibility.
  </p>
</section>

<section class="journals">
  <h2>Tales from the Weave</h2>
  <p>Explore narratives, world-building, and glimpses into the Quantum Weave universe.</p>
  {% assign qw_posts = site.posts | where_exp: "post", "post.tags contains 'quantum-weave'" | sort: 'date' | reverse | slice: 0, 6 %}
  {% if qw_posts.size > 0 %}
  <div class="journal-grid">
    {% for post in qw_posts %}
      <article class="journal-card">
        <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
        <p class="meta">{{ post.date | date: "%b %-d, %Y" }}</p>
        <p>{{ post.excerpt | strip_html | truncate: 140 }}</p>
      </article>
    {% endfor %}
  </div>
  <p><a class="inline" href="/tags/tag/?tag=quantum-weave">Explore all Quantum Weave content →</a></p>
  {% else %}
  <p>Stories coming soon. Sign up below to be notified when new narratives are published.</p>
  {% endif %}
</section>

<section class="highlights">
  <h2>The Nine Disciplines</h2>
  <p>Magic in Quantum Weave is organized into nine disciplines, each grounded in quantum mechanics:</p>
  <ul>
    <li><strong>Infomancy</strong> - Data and communication</li>
    <li><strong>Fabricurgy</strong> - Textiles and materials</li>
    <li><strong>Corpus</strong> - Bodies and healing</li>
    <li><strong>Pyrosonics</strong> - Sound and heat</li>
    <li><strong>Spectra</strong> - Light and illusion</li>
    <li><strong>Cryoarchitectonics</strong> - Cold and preservation</li>
    <li><strong>Luxomancy</strong> - Emotional manipulation</li>
    <li><strong>Terraducts</strong> - Earth, metals, and gravity</li>
    <li><strong>Floramancy</strong> - Plant life and ecosystems</li>
  </ul>
</section>

<section class="highlights">
  <h2>What You'll Find</h2>
  <ul>
    <li>Magic as forgotten nanotechnology</li>
    <li>Quantum physics meets fantasy world-building</li>
    <li>Reality-bending Corrupted Weave Zones</li>
    <li>Ancient mysteries and lost civilizations</li>
    <li>Characters torn between truth and belief</li>
  </ul>
</section>

<section class="newsletter" id="newsletter">
  <h2>Stay Connected</h2>
  <p>Get updates on new narratives, world-building reveals, and book progress.</p>
  <script async data-uid="f5ff9be78a" src="https://sirkitree.kit.com/f5ff9be78a/index.js"></script>
</section>

<section class="cta">
  <a class="btn btn-primary" href="/tags/tag/?tag=quantum-weave">Read Narratives</a>
  <a class="btn secondary" href="/books/">Back to Books</a>
</section>
