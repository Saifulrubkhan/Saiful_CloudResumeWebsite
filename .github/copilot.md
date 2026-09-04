# Copilot Instructions – Cloud Resume Website

## Project Context

**Purpose**: Demonstrate AWS cloud skills through a serverless resume website (Cloud Resume Challenge).  
**Live**: https://khansaiful.com  
**Architecture**: Vite static build → S3 → CloudFront → Route 53; Lambda/API Gateway/DynamoDB in sibling repos.  
**Theme**: HTML5 UP "Strongly Typed" with shared Handlebars partials and vanilla JS (no jQuery).

## Source layout

| Path | Role |
|------|------|
| `src/pages/*.html` | Page bodies + `{{> partial}}` includes |
| `src/partials/` | Shared `head`, `header`, `footer` |
| `src/js/` | Vanilla chrome, theme, visitor counter, contact form, quotes |
| `src/styles/` | `site.css`, `main.scss`, `_northline.scss`, `_nav.scss`, `_custom.scss`, `_skills.scss` |
| `public/` | Static assets (`images/`, webfonts, Font Awesome, documents) |
| `dist/` | **Deploy this folder to S3** (`npm run build`) |

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Conventions

- Edit shared chrome only in `src/partials/` — never paste nav/footer into pages.
- Prefer new CSS in `src/styles/_custom.scss`, `_nav.scss`, or `_northline.scss`.
- Do not reintroduce jQuery or Dropotron; nav is `src/js/main.js`.
- CloudFront page: `aws-cloudfront.html`. Homepage project image: `/images/feature_project.jpg`.
- Domain in docs/content: `khansaiful.com`.
- CI/CD: GitHub Actions OIDC (`.github/workflows/deploy.yml`).

## Adding a page

1. Add `src/pages/your-page.html` with `{{> head}}`, `{{> header}}`, content, `{{> footer}}`.
2. Link it from `src/partials/header.hbs`.
3. `npm run build` and confirm `dist/your-page.html`.
