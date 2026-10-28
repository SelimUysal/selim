# Selim Uysal — Personal Portfolio

A responsive, bilingual and accessible software engineering portfolio, hosted on GitHub Pages.

**Live website:** https://selimuysal.github.io/selim/

## Architecture
- `index.html`: main portfolio and instant project search
- `projects.html`: all software and academic projects
- `cv.html`, `industry-cv.html`: printable CV views
- `assets/data.js`: a single source for project links, descriptions and credentials
- `assets/site.js`: multilingual UI, search, and theme preferences
- `assets/site.css`: responsive design system

All data is rendered client-side without a backend. PDF reports and certificates are provided in `assets/`.

To deploy with GitHub Pages: **Settings → Pages → Deploy from a branch → main → /(root)**.
