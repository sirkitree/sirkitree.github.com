---
layout: page
title: WebSim Experiments
permalink: /websim/
---

A collection of experiments created on [WebSim.ai](https://websim.ai/@sirkitree).

<div class="websim-grid">
{% assign projects = site.static_files | where_exp: "file", "file.path contains 'websim-projects'" %}
{% for project in projects %}
  {% if project.path contains '.html' %}
    {% assign filename = project.path | split: "/" | last %}
    {% assign title = filename | replace: ".html", "" | replace: "-", " " | capitalize %}
    {% assign thumbnail = filename | replace: ".html", ".png" %}
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
          <img src="{{ thumbnail_path }}" alt="{{ title }}" class="websim-thumbnail">
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

<style>
.websim-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.websim-item {
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.websim-item:hover {
  transform: translateY(-5px);
}

.websim-link {
  text-decoration: none;
  color: inherit;
}

.websim-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
}

.websim-thumbnail-fallback {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-content {
  text-align: center;
  color: white;
}

.fallback-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.fallback-text {
  font-size: 1.2rem;
  opacity: 0.9;
}

.websim-title {
  padding: 1rem;
  margin: 0;
  font-size: 1rem;
  text-align: center;
}

@media (max-width: 600px) {
  .websim-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .websim-thumbnail {
    height: 150px;
  }
  
  .fallback-icon {
    font-size: 2rem;
  }
  
  .fallback-text {
    font-size: 1rem;
  }
}
</style>
