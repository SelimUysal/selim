# Selim Uysal — Academic + Industry Portfolio

One free GitHub Pages website, two audience-specific experiences, and one searchable catalogue of projects. This is a static HTML/CSS/JavaScript project: no framework, hosting subscription, build pipeline, API key, or server is needed to publish it.

## Pages

| Page | File | Audience |
|---|---|---|
| Academic home | `index.html` | Graduate admissions, prospective supervisors, academic visitors |
| Industry home | `industry.html` | Recruiters and software engineering teams |
| All projects | `projects.html` | Single searchable, filterable project catalogue |
| Academic CV (web view) | `cv.html` | Printable overview; the supplied academic PDF is linked separately |
| Industry résumé (web view) | `industry-cv.html` | Printable professional overview |

## Verified materials incorporated

- University: Atılım University, B.Sc. Software Engineering (2025), Fall 2023 Honor Certificate.
- Three undergraduate reports (English-language PDFs in `assets/reports/`): SEE AI / TEKNOFEST AI in Transportation, SEEapp Oracle database design, and SE461 software design patterns.
- Two certificates (PDFs in `assets/certificates/`): Generative AI with Large Language Models (DeepLearning.AI / AWS / Coursera, 02 Feb 2024); Sıfırdan İleri Seviye Oracle-SQL (BTK Akademi, 16 Jan 2024).
- Original supplied academic CV (PDF in `assets/cv/`).
- GitHub README-backed software projects: Hayat Rehberi, Video Speed, News-to-Telegram Automation, Quran Memorization & Arabic Analysis.
- Additional learning repositories: C Programming Exercises, Python Programming Exercises, SQL Practice Resources.

The academic reports are undergraduate work, **not peer-reviewed publications**. The TEKNOFEST placement means **11th of 198 teams in the preliminary design report evaluation**, not the overall final standings. Web demos and store URLs come from project READMEs; the GitHub Pages sites and external stores may change or be temporarily unavailable.

Public copies of two academic reports have had a student number removed from their cover text. The original user-uploaded DOCX files were not modified. PDF metadata author fields in public reports were cleared to avoid accidental third-party attribution.

## One place to manage all project links

Open `assets/content.js` and modify the matching object in `projects`. Each project has its name, bilingual description, technologies, audience (`showOn`) and evidence links in one place. The website reads this same array for Academic, Industry, and Projects Directory. Example:

```js
{
  id: 'project-id',
  showOn: ['industry'],
  name: { en: 'Project name', tr: 'Proje adı' },
  description: { en: 'Summary', tr: 'Özet' },
  stack: ['TypeScript'],
  links: [
    { kind: 'live', url: 'https://example.org' },
    { kind: 'source', url: 'https://github.com/USER/REPO' }
  ]
}
```

Evidence link kinds: `live` (hosted demo), `store` (app store), `source` (GitHub), `video` (walkthrough), and `report` (local PDF). Add an item only when the link truly exists. Do not use a fictitious demo link for a local-only prototype. The `archive` array lists learning repositories separately; the `certificates` array controls both credential cards and their PDF links. English and Turkish section labels live in `translations`.

After changing content, update the search-engine/no-JavaScript English snapshots with:

```sh
node scripts/prerender.mjs
```

The website works without a package manager or external CDN. On a real browser with JavaScript enabled, `EN / TR`, light/dark appearance, mobile navigation, project search and filters work interactively; the current preference is stored in local browser storage and reused across pages.

## Run locally

Start a local HTTP server in this directory (opening via `file://` may block ES modules):

```sh
python -m http.server 8000
```

Open `http://localhost:8000/`, then test:

- `/industry.html`
- `/projects.html`
- `/cv.html` and `/industry-cv.html`

## Publish to GitHub Pages

1. Keep a backup or a separate branch before changing your new repo `https://github.com/SelimUysal/selim-uysal`.
2. Upload the contents of this ZIP to the **repository root** (not a `docs/` subfolder). Keep any unrelated files; do not delete any other project repositories.
3. GitHub repository → **Settings → Pages** → source **Deploy from a branch**, branch **main**, folder **/(root)** → Save. If it currently points to `/docs`, change it to `/(root)`.
4. Once deployed, use these addresses:
   - Academic: `https://selimuysal.github.io/selim-uysal/`
   - Industry: `https://selimuysal.github.io/selim-uysal/industry.html`
   - Projects: `https://selimuysal.github.io/selim-uysal/projects.html`
   - Academic CV: `https://selimuysal.github.io/selim-uysal/cv.html`
   - Industry CV: `https://selimuysal.github.io/selim-uysal/industry-cv.html`
5. Verify each external link and each document on the published site. Watch for browser caching (hard refresh if needed).

**IMPORTANT:** This archive is a prepared deliverable, **not an automatically published update**. This file package has not been committed unless the final delivery explicitly confirms a successful GitHub upload.

## Privacy and evidence notes

- Your email address comes from the supplied CV and is displayed to help people contact you.
- Certificates are shown as credential completions, not employment, awards, or academic journal publications.
- The separate `proje` experimental repository was intentionally omitted from public highlights because its README warns of possible exposed credentials. Review and rotate any secrets before promoting it.
- Projects without a verifiable public README or dependable destination were not invented or given artificial demo links.
- The supplied academic CV PDF is included as-is; check it before publication for any details you want to keep private.
