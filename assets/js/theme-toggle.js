(function () {
	var root = document.documentElement;
	var toggle = document.getElementById('theme-toggle');
	if (!toggle) {
		return;
	}
	var savedTheme = localStorage.getItem('theme');
	var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	var theme = savedTheme || (prefersDark ? 'dark' : 'light');

	function updateToggle() {
		var isDark = root.getAttribute('data-theme') === 'dark';
		var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
		toggle.setAttribute('aria-label', label);
		toggle.setAttribute('title', label);
		toggle.querySelector('.theme-icon').style.filter = isDark ? 'invert(1)' : 'none';
		toggle.querySelector('.sr-only').textContent = label;
	}

	root.setAttribute('data-theme', theme);
	updateToggle();

	toggle.addEventListener('click', function () {
		var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		root.setAttribute('data-theme', nextTheme);
		localStorage.setItem('theme', nextTheme);
		updateToggle();
	});
}());
