/**
 * One-shot migrator: wrap existing HTML pages with Handlebars partials.
 * Run: node scripts/migrate-html.mjs
 */
import { readFileSync, writeFileSync, readdirSync, renameSync, existsSync, unlinkSync } from 'node:fs';
import { join, basename } from 'node:path';

const root = process.cwd();

const PAGE_META = {
  'index.html': { title: 'Saiful Khan', bodyClass: 'homepage is-preload' },
  'Project.html': { title: 'AWS Cloud Challenge - Saiful Khan', bodyClass: 'is-preload' },
  'vscode.html': { title: 'VS Code Workflow - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'awss3Hosting.html': { title: 'AWS S3 Hosting - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'aws_route53.html': { title: 'Route 53 Domain - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'aws-cloudfront.html': { title: 'CloudFront HTTPS - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'awscloufront.html': { title: 'CloudFront HTTPS - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'github.html': { title: 'GitHub CI/CD - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'cost_optimization.html': { title: 'AWS Cost Optimization - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'visitor_counter.html': { title: 'Visitor Counter - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'terraform.html': { title: 'Terraform Infrastructure - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'resume.html': { title: 'Resume - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
  'journey.html': { title: 'My Journey to the Cloud - Saiful Khan', bodyClass: 'no-sidebar is-preload' },
};

function extractMain(html) {
  // Content after header section, before footer
  const headerEnd = html.search(/<\/section>\s*(?:<!--\s*Features|<!--\s*Banner|<div id="wrapper"|<!--\s*Main)/i);
  let start = -1;
  if (headerEnd !== -1) {
    start = html.indexOf('</section>', headerEnd >= 0 ? 0 : 0);
    // find the header's closing section specifically: first </section> after id="header"
    const headerIdx = html.indexOf('id="header"');
    if (headerIdx !== -1) {
      start = html.indexOf('</section>', headerIdx) + '</section>'.length;
    }
  } else {
    const headerIdx = html.indexOf('id="header"');
    start = html.indexOf('</section>', headerIdx) + '</section>'.length;
  }

  const footerIdx = html.search(/<!--\s*Footer\s*-->|<section id="footer">/i);
  if (start < 0 || footerIdx < 0) {
    throw new Error('Could not locate header/footer boundaries');
  }
  return html.slice(start, footerIdx).trim();
}

function transform(file) {
  const path = join(root, file);
  let html = readFileSync(path, 'utf8');

  html = html
    .replaceAll('awscloufront.html', 'aws-cloudfront.html')
    .replaceAll('jonathanlayman.com', 'khansaiful.com')
    .replaceAll('feataure_resume.jpg', 'feature_resume.jpg')
    .replaceAll('images/', '/images/')
    .replaceAll('"/images/', '"/images/')
    .replaceAll("'/images/", "'/images/");

  // Avoid double prefix
  html = html.replaceAll('//images/', '/images/');
  html = html.replaceAll('src="//images/', 'src="/images/');

  const meta = PAGE_META[file] || {
    title: 'Saiful Khan',
    bodyClass: 'no-sidebar is-preload',
  };

  const main = extractMain(html);

  const out = `<!DOCTYPE HTML>
<html lang="en">
	<head>
		{{> head title="${meta.title}" }}
	</head>
	<body class="${meta.bodyClass}">
		<div id="page-wrapper">
			{{> header }}
			${main}
			{{> footer }}
		</div>
	</body>
</html>
`;

  const outName = file === 'awscloufront.html' ? 'aws-cloudfront.html' : file;
  writeFileSync(join(root, outName), out, 'utf8');
  if (outName !== file && existsSync(path)) {
    unlinkSync(path);
  }
  console.log('Migrated', outName);
}

const files = readdirSync(root).filter((f) => f.endsWith('.html'));
for (const file of files) {
  try {
    transform(file);
  } catch (err) {
    console.error('FAIL', file, err.message);
  }
}
