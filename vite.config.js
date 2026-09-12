import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';

const root = fileURLToPath(new URL('.', import.meta.url));
const pagesDir = resolve(root, 'src/pages');

const htmlPages = readdirSync(pagesDir).filter((f) => f.endsWith('.html'));

const pageDescriptions = {
  'index.html': 'Portfolio of Saiful Khan, a DevOps Engineer and AWS Solutions Architect building secure, scalable cloud platforms.',
  'aws_serverless_crud.html': 'A serverless CRUD application using API Gateway, Lambda, DynamoDB, Python, and Terraform.',
	'aws_employee_management.html': 'An authenticated serverless employee management application using Cognito, API Gateway, Lambda, DynamoDB, CloudFront, CloudWatch, and SNS.',
  's3_security_challenge.html': 'A hands-on S3 security challenge covering public access blocking, least privilege, IAM roles, HTTPS enforcement, and encryption at rest.',
  'Project.html': 'A production-style AWS Cloud Resume Challenge covering hosting, HTTPS, CI/CD, serverless APIs, and infrastructure as code.',
  'resume.html': 'Resume, experience, certifications, and technical skills for Saiful Khan, DevOps Engineer and AWS Solutions Architect.',
  'journey.html': 'Saiful Khan\'s journey from cloud fundamentals to DevOps, platform engineering, and AWS architecture.',
  'contact_form.html': 'A serverless contact form built with API Gateway, Lambda, DynamoDB, and AWS SES.',
  'visitor_counter.html': 'A serverless visitor counter built with API Gateway, Lambda, and DynamoDB.',
  'terraform.html': 'Terraform infrastructure as code used to provision and manage the AWS Cloud Resume Challenge.',
  'github.html': 'GitHub Actions CI/CD and OIDC deployment for the AWS Cloud Resume Challenge.',
  'cost_optimization.html': 'AWS cost monitoring and optimization practices applied to a production-style cloud resume website.',
  'aws-cloudfront.html': 'CloudFront HTTPS delivery for the AWS Cloud Resume Challenge.',
  'aws_route53.html': 'Route 53 domain configuration for the AWS Cloud Resume Challenge.',
  'awss3Hosting.html': 'Static website hosting with Amazon S3 for the AWS Cloud Resume Challenge.',
  'vscode.html': 'The VS Code workflow used to build and maintain the AWS Cloud Resume Challenge.',
};

const input = Object.fromEntries(
  htmlPages.map((file) => [basename(file, '.html'), resolve(pagesDir, file)])
);

/** Emit MPA HTML at dist/*.html instead of dist/src/pages/*.html */
function flattenHtmlOutput() {
  return {
    name: 'flatten-html-output',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName];
        if (chunk.type === 'asset' && fileName.endsWith('.html')) {
          const flat = basename(fileName);
          if (fileName !== flat) {
            chunk.fileName = flat;
            delete bundle[fileName];
            bundle[flat] = chunk;
          }
        }
      }
    },
  };
}

function devRootPage() {
  return {
    name: 'dev-root-page',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url === '/') {
          request.url = '/src/pages/index.html';
        } else if (request.url && htmlPages.includes(request.url.slice(1))) {
          request.url = `/src/pages/${request.url.slice(1)}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(root, 'src/partials'),
      context(pagePath) {
        const file = basename(pagePath);
        const isHome = file === 'index.html';
        return {
          isHome,
          pageFile: file,
          canonicalPath: isHome ? '/' : `/${file}`,
          description: pageDescriptions[file],
          showContactNav: true,
          loadQuotes: isHome,
        };
      },
    }),
    flattenHtmlOutput(),
    devRootPage(),
  ],
  publicDir: resolve(root, 'public'),
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
    rollupOptions: { input },
  },
  server: {
    open: '/src/pages/index.html',
  },
});
