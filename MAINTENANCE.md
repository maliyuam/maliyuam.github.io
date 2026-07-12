# Maintenance mode

The site is currently in **maintenance mode**: `index.html` and `404.html` are a
standalone "under construction" page, so every URL (root, unknown paths, and the
former content pages) shows it. The real site is preserved untouched under `*-site`
names and directories.

## What's stashed

| Live path (now shows maintenance) | Preserved as            |
| --------------------------------- | ----------------------- |
| `index.html` (real homepage)      | `home.html`             |
| `404.html` (real 404)             | `404-site.html`         |
| `research.html`                   | `research-site.html`    |
| `projects.html`                   | `projects-site.html`    |
| `experience.html`                 | `experience-site.html`  |
| `work-with-me.html`               | `work-with-me-site.html`|
| `projects/`                       | `projects-dir-site/`    |
| `blog/`                           | `blog-site/`            |

`assets/` is shared and untouched, so both the maintenance page and the real site
keep working.

## Turn the site back ON (restore)

Easiest — revert the maintenance commit:

```bash
git revert <maintenance-commit-hash>
```

Or rename everything back explicitly:

```bash
git rm index.html 404.html
git mv home.html index.html
git mv 404-site.html 404.html
git mv research-site.html research.html
git mv projects-site.html projects.html
git mv experience-site.html experience.html
git mv work-with-me-site.html work-with-me.html
git mv projects-dir-site projects
git mv blog-site blog
```

Then commit and deploy.
