# sirkitree.github.com

My personal blog and website, built with [Jekyll](https://jekyllrb.com) and hosted on GitHub Pages.

## Adding a New Blog Post

1. Create a new file in `_posts` following the format `YYYY-MM-DD-your-post-title.md`.
2. Copy and adjust the front matter from an existing post.
3. Change the `date` and `title` fields.
4. Write your post content in Markdown.
5. Run `bundle exec jekyll serve` and verify it at <http://localhost:4000>.
6. When ready, stage and commit your changes:

   ```bash
   git add _posts/YYYY-MM-DD-your-post-title.md
   git commit -m "Add new post: Your Post Title"
   git push
   ```

## Developer Guide

For detailed instructions on setting up, building, and working with this codebase, see [DEVELOPMENT.md](DEVELOPMENT.md).
