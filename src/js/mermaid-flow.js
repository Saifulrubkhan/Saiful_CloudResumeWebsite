const MERMAID_CDN =
  'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';

export async function initMermaidFlows() {
  const nodes = document.querySelectorAll('pre.mermaid');
  if (!nodes.length) return;

  if (!window.mermaid) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = MERMAID_CDN;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const theme =
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default';

  window.mermaid.initialize({
    startOnLoad: false,
    theme,
    securityLevel: 'strict',
    flowchart: { curve: 'basis', htmlLabels: true },
  });

  await window.mermaid.run({ nodes: [...nodes] });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMermaidFlows().catch((err) => console.error('Mermaid load failed:', err));
  });
} else {
  initMermaidFlows().catch((err) => console.error('Mermaid load failed:', err));
}
