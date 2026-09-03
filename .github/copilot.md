# Copilot Instructions – Cloud Resume Website

## Project Context

**Purpose**: Demonstrate AWS cloud skills through a serverless resume website (Cloud Resume Challenge).  
**Current Stage**: Stage 1 complete (static site on S3 + CloudFront HTTPS). Future stages: visitor counter (Lambda/DynamoDB), CI/CD automation.  
**Live**: https://jonathanlayman.com  
**Architecture**: Static HTML/CSS/JS → S3 (private) → CloudFront (CDN) → Route 53 (DNS).  
**Theme**: HTML5 UP "Strongly Typed" (responsive, jQuery-enhanced).

## Key Patterns & Conventions

### Content Structure
- **HTML Template**: Every page inherits the same header/nav/content/footer structure from [index.html](index.html)
- **Project Pages**: Named `project_*.html` (e.g., `project_awss3hosting.html`) describe individual Cloud Resume Challenge milestones
- **Navigation**: Consistent across all pages via `<nav id="nav">` with dropdown menus (JavaScript-enhanced)
- **Sidebar**: Resume page uses `<section id="sidebar">` to display certification badges as a list of linked images

### Styling

- **SASS-Compiled**: CSS originates from [assets/sass/main.scss](assets/sass/main.scss) and compiles to [assets/css/main.css](assets/css/main.css)
- **Modular Imports**: SASS imports from `libs/` (variables, mixins, breakpoints, vendor resets)
- **Breakpoints**: Four responsive tiers in code: `xlarge` (1281–1680px), `large` (981–1280px), `medium` (737–980px), `small` (≤736px)
- **Animations**: Use `.is-preload` body class to disable animations until page load completes

### JavaScript

- **jQuery-Based**: All JS in [assets/js/main.js](assets/js/main.js) runs jQuery/plugins–no build step needed
- **Plugins**: `jquery.dropotron.min.js` powers dropdown menus; `util.js` provides breakpoint detection and responsive utilities
- **No Modern Bundler**: All `.js` files are plain, no npm/webpack; link scripts directly in HTML

## Development Workflow

1. **HTML Changes**: Edit `.html` files directly—no build step. Test in browser immediately.
2. **CSS Changes**: 
   - Edit SCSS in `assets/sass/main.scss` or `libs/*.scss`
   - Compile to `assets/css/main.css` manually (e.g., via VS Code extension or command-line `sass` tool)
   - Alternatively, edit compiled `main.css` directly for quick prototyping
3. **JavaScript**: Modify `assets/js/main.js` or add new `.js` files; link in HTML `<script>` tags
4. **Images**: Store in `images/` directory; reference relatively in HTML (e.g., `src="images/logo.png"`)

## Common Tasks

### Add a New Project Page
1. Copy an existing `project_*.html` as template
2. Update title, header, and content sections
3. Add link to new page in navigation dropdown (`<li><a href="project_newname.html">New Project</a></li>`)
4. Ensure `<meta>` viewport tag and stylesheet links match

### Update Resume Section
- Edit skills, experience, or education directly in [resume.html](resume.html) under appropriate `<h5>` sections
- Keep consistent formatting: `<h4>` for role titles, `<h6>` for duration/company, `<ul>` for bullet points
- Certification badges in sidebar: add `<li><article>` blocks with Credly links and badge images

### Fix Responsive Layout Issues
- Check which breakpoint is affected using [assets/js/main.js](assets/js/main.js) breakpoint config
- Edit corresponding SCSS media queries in `assets/sass/main.scss` (search `@include media`)
- Or override in `assets/css/main.css` if SCSS recompile unavailable

## Git & Deployment

- **Branching**: `master` = production (deployed); feature work in feature branches
- **Deployment**: Automated via GitHub Actions (Stage 3 planned); currently manual S3 + CloudFront sync
- **Commit Scope**: Keep commits focused—one feature or fix per commit for clean history

## Critical Integration Points

- **AWS Sync**: Manual uploads to S3 bucket and CloudFront invalidation required (not yet automated)
- **Custom Domain**: DNS records managed in Route 53; TTL typically 300s
- **CloudFront Cert**: ACM certificate auto-renews; no action needed if cert tied to distribution
- **Visitor Counter** (planned): Will require Lambda/DynamoDB integration—watch for API Gateway endpoints

## When Editing, Reference These Files

- Template baseline: [index.html](index.html)
- Styling reference: [assets/sass/main.scss](assets/sass/main.scss), [assets/css/main.css](assets/css/main.css)
- JavaScript interaction: [assets/js/main.js](assets/js/main.js)
- Resume structure: [resume.html](resume.html)
- Project example: [project_awss3hosting.html](project_awss3hosting.html)