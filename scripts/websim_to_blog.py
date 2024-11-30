import os
from datetime import datetime
import re
import json

def load_project_list(filename):
    """Load project list from a JSON file"""
    with open(filename, 'r') as f:
        return json.load(f)

def process_project_directory(project_dir):
    """Process a single project directory and return its contents"""
    print(f"Processing directory: {project_dir}")
    
    project_name = os.path.basename(project_dir)
    
    # Read the project files
    try:
        with open(os.path.join(project_dir, 'index.html'), 'r') as f:
            html_content = f.read()
        with open(os.path.join(project_dir, 'styles.css'), 'r') as f:
            css_content = f.read()
        with open(os.path.join(project_dir, 'script.js'), 'r') as f:
            js_content = f.read()
            
        return {
            'title': project_name.replace('-', ' ').title(),
            'html': html_content,
            'css': css_content,
            'js': js_content
        }
    except FileNotFoundError as e:
        print(f"Warning: Could not read all files in {project_dir}: {e}")
        return None

def create_blog_post(project, content):
    """Create a blog post for a project"""
    today = datetime.now().strftime('%Y-%m-%d')
    post_slug = slugify(project['title'])
    
    # Create project directory in assets
    project_dir = f"assets/websim-projects/{post_slug}"
    os.makedirs(project_dir, exist_ok=True)
    
    # Save project files
    with open(f"{project_dir}/index.html", 'w') as f:
        f.write(content['html'])
    with open(f"{project_dir}/styles.css", 'w') as f:
        f.write(content['css'])
    with open(f"{project_dir}/script.js", 'w') as f:
        f.write(content['js'])
    
    # Create blog post
    post_content = f"""---
layout: post
title: "{project['title']}"
date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
categories: websim projects
---

A project created on WebSim.ai that I've archived here.
Original project: [View on WebSim.ai]({project['url']})

You can view this project directly [here](/assets/websim-projects/{post_slug}/index.html)

### Project Files:

#### HTML:
```html
{content['html']}
```

#### CSS:
```css
{content['css']}
```

#### JavaScript:
```javascript
{content['js']}
```
"""
    
    post_filename = f"_posts/{today}-{post_slug}.md"
    print(f"Creating blog post: {post_filename}")
    with open(post_filename, 'w') as f:
        f.write(post_content)

def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    return re.sub(r'[^a-z0-9-]', '-', text)

def main():
    # Create necessary directories
    os.makedirs('websim-projects', exist_ok=True)
    os.makedirs('assets/websim-projects', exist_ok=True)
    
    # Process all project directories
    projects_dir = "websim-projects"
    if not os.path.exists(projects_dir):
        print(f"Error: {projects_dir} directory not found")
        print(f"Please create {projects_dir} directory and add your WebSim projects")
        return
    
    # Create projects.json template if it doesn't exist
    projects_json = os.path.join(projects_dir, 'projects.json')
    if not os.path.exists(projects_json):
        template = []
        for dirname in os.listdir(projects_dir):
            if os.path.isdir(os.path.join(projects_dir, dirname)) and dirname != '__pycache__':
                template.append({
                    'title': dirname.replace('-', ' ').title(),
                    'url': f'https://websim.ai/p/YOUR_PROJECT_ID_HERE',
                    'description': 'Add your project description here'
                })
        
        with open(projects_json, 'w') as f:
            json.dump(template, f, indent=2)
        
        print(f"\nCreated {projects_json} template.")
        print("Please edit this file to add your project URLs and descriptions.")
        print("Then run this script again to generate the blog posts.")
        return
    
    # Load project metadata
    projects = load_project_list(projects_json)
    print(f"\nFound {len(projects)} projects in {projects_json}")
    
    # Process each project
    for project in projects:
        print(f"\nProcessing project: {project['title']}")
        project_dir = os.path.join(projects_dir, slugify(project['title']))
        
        content = process_project_directory(project_dir)
        if content:
            create_blog_post(project, content)
            print(f"Completed processing {project['title']}")

if __name__ == "__main__":
    main() 