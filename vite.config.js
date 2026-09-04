import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';

const root = fileURLToPath(new URL('.', import.meta.url));
const pagesDir = resolve(root, 'src/pages');

const htmlPages = readdirSync(pagesDir).filter((f) => f.endsWith('.html'));

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
          showContactNav: true,
          loadQuotes: isHome,
        };
      },
    }),
    flattenHtmlOutput(),
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
