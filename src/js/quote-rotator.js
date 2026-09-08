(function () {
  const quoteElement = document.getElementById('rotating-quote');
  if (!quoteElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const quotes = [
    '<strong>Analyst</strong> at heart. <strong>Teacher</strong> in practice. Driven to create and solve.',
    'Build for reliability. Design for people. Operate with curiosity.',
    'Cloud platforms should be secure, scalable, and easier to understand.',
    'Turn complex infrastructure into clear, dependable systems.',
  ];
  let quoteIndex = 0;
  let intervalId = null;

  const rotate = () => {
    quoteElement.classList.add('quote-is-changing');
    window.setTimeout(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      quoteElement.innerHTML = quotes[quoteIndex];
      quoteElement.classList.remove('quote-is-changing');
    }, 300);
  };

  const stop = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const start = () => {
    stop();
    intervalId = window.setInterval(rotate, 4200);
  };

  quoteElement.addEventListener('mouseenter', stop);
  quoteElement.addEventListener('mouseleave', start);
  quoteElement.addEventListener('focusin', stop);
  quoteElement.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  start();
})();
