import os
from bs4 import BeautifulSoup
import re

def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9-]', '-', text)
    text = re.sub(r'-+', '-', text)  # Replace multiple hyphens with single hyphen
    text = text.strip('-')  # Remove leading/trailing hyphens
    return text

def analyze_code_for_title(html_content):
    """Analyze code to determine an appropriate title when metadata is missing"""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Look for key elements and patterns that might indicate the purpose
    script = soup.find('script')
    if not script:
        return None
        
    code = script.string if script.string else ''
    
    # Check for specific patterns
    if 'hexDist' in code and 'iAudioReactivity' in code:
        return "Audio Reactive Hexagonal Shader"
    elif 'class Tentacle' in code and 'drawTentacleSegment' in code:
        return "Interactive Tentacle Art Generator"
    elif 'colorMode(HSB)' in code and 'rotate(i*PI/3)' in code:
        return "Radial HSB Color Pattern"
        
    return None

def extract_title(html_content):
    """Extract title from HTML content"""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Try to find title in different places
    title = None
    
    # Try meta title
    meta_title = soup.find('meta', property='og:title')
    if meta_title:
        title = meta_title.get('content', '').replace('websim.ai – ', '')
    
    # Try h1
    if not title:
        h1 = soup.find('h1')
        if h1:
            title = h1.text.strip()
    
    # Try title tag
    if not title:
        title_tag = soup.find('title')
        if title_tag:
            title = title_tag.text.replace('websim.ai – ', '')
    
    # If no title found, analyze the code
    if not title:
        title = analyze_code_for_title(html_content)
    
    # If still no title found, use a placeholder
    if not title:
        return None
    
    return title.strip()

def main():
    projects_dir = 'websim-projects'
    
    # Dictionary to store file info
    projects = []
    
    # Process each HTML file
    for filename in os.listdir(projects_dir):
        if not filename.endswith('.html') or filename.startswith('.'):
            continue
            
        filepath = os.path.join(projects_dir, filename)
        
        # Read the file
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Extract title
        title = extract_title(content)
        if not title:
            print(f"Could not extract title from {filename}")
            continue
        
        # Create new filename
        new_filename = f"{slugify(title)}.html"
        new_filepath = os.path.join(projects_dir, new_filename)
        
        # Store project info
        projects.append({
            'title': title,
            'filename': new_filename,
            'original_filename': filename
        })
        
        # Rename file
        print(f"Renaming: {filename} -> {new_filename}")
        os.rename(filepath, new_filepath)
    
    # Create projects page
    projects_page = """---
layout: page
title: WebSim Experiments
permalink: /websim/
---

# WebSim Experiments

A collection of experiments created on [WebSim.ai](https://websim.ai/@sirkitree).

{% assign projects = site.static_files | where: "path", "/websim-projects/*.html" %}

| Project | Link |
|---------|------|
"""
    
    # Add each project to the table
    for project in sorted(projects, key=lambda x: x['title'].lower()):
        projects_page += f"| {project['title']} | [View](/websim-projects/{project['filename']}) |\n"
    
    # Save projects page
    with open('websim.md', 'w') as f:
        f.write(projects_page)
    
    print("\nCreated websim.md with project listing")

if __name__ == "__main__":
    main() 