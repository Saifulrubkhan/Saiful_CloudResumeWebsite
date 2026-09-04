const API_URL =
  'https://lqwo3tc3q5.execute-api.us-east-1.amazonaws.com/prod/api/visitor';

const CACHE_KEY = 'crc_visitor_views';

async function initVisitorCounter() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached !== null) {
    updateCounterDisplay(Number(cached));
    return;
  }

  try {
    // Count once per browser tab session; later page navigations reuse the cache.
    const response = await fetch(`${API_URL}?increment=1`, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    const views = Number(data.views ?? 0);
    sessionStorage.setItem(CACHE_KEY, String(views));
    updateCounterDisplay(views);
  } catch (error) {
    console.error('Error updating visitor counter:', error);
    updateCounterDisplay(0);
  }
}

function updateCounterDisplay(count) {
  document.querySelectorAll('#visitor-count, [data-visitor-count]').forEach((el) => {
    el.textContent = Number(count).toLocaleString();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVisitorCounter);
} else {
  initVisitorCounter();
}
