import { initChrome } from './main.js';
import './theme-toggle.js';
import './visitor-counter.js';
import './contact-form.js';
import './quote-rotator.js';

initChrome();

if (document.querySelector('pre.mermaid')) {
	import('./mermaid-flow.js').catch((err) => {
		console.error('Mermaid load failed:', err);
	});
}
