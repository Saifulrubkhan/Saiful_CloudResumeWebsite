(function () {
	var quoteElement = document.getElementById('rotating-quote');
	if (!quoteElement || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	var quotes = [
		'<strong>Analyst</strong> at heart. <strong>Teacher</strong> in practice. Driven to create and solve.',
		'Build for reliability. Design for people. Operate with curiosity.',
		'Cloud platforms should be secure, scalable, and easier to understand.',
		'Turn complex infrastructure into clear, dependable systems.'
	];
	var quoteIndex = 0;

	window.setInterval(function () {
		quoteElement.classList.add('quote-is-changing');
		window.setTimeout(function () {
			quoteIndex = (quoteIndex + 1) % quotes.length;
			quoteElement.innerHTML = quotes[quoteIndex];
			quoteElement.classList.remove('quote-is-changing');
		}, 300);
	}, 4200);
}());
