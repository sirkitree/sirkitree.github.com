---
layout: page
title: WebSim Experiments
permalink: /websim/
eyebrow: WebSim
headline: Shaders, fractals, and other things that only exist in a browser tab.
lede: 'A collection of experiments created on <a href="https://websim.ai/@sirkitree">WebSim.ai</a>.'
---

<div class="websim-grid">
{% assign projects = site.static_files | where_exp: "file", "file.path contains 'websim-projects'" %}
{% for project in projects %}
  {% if project.path contains '.html' %}
    {% assign filename = project.path | split: "/" | last %}
    {% assign slug = filename | replace: ".html", "" %}
    {%- comment -%}
      Prefer the hand-written title in _data/websim.yml; fall back to the
      filename so a newly dropped-in project still renders something sane.
    {%- endcomment -%}
    {% assign fallback = slug | replace: "-", " " | capitalize %}
    {% assign title = site.data.websim[slug] | default: fallback %}
    {% assign thumbnail = filename | replace: ".html", ".webp" %}
    {% assign thumbnail_path = "/assets/websim-thumbnails/" | append: thumbnail %}
    {% assign has_thumbnail = false %}
    {% for static_file in site.static_files %}
      {% if static_file.path == thumbnail_path %}
        {% assign has_thumbnail = true %}
        {% break %}
      {% endif %}
    {% endfor %}
    <div class="websim-item">
      <a href="{{ project.path }}" class="websim-link">
        {% if has_thumbnail %}
          <img loading="lazy" decoding="async" src="{{ thumbnail_path }}" alt="{{ title }}" class="websim-thumbnail">
        {% else %}
          <div class="websim-thumbnail websim-thumbnail-fallback">
            <div class="fallback-content">
              <div class="fallback-icon">⚡️</div>
              <div class="fallback-text">Interactive Demo</div>
            </div>
          </div>
        {% endif %}
        <h3 class="websim-title">{{ title }}</h3>
      </a>
    </div>
  {% endif %}
{% endfor %}
</div>
