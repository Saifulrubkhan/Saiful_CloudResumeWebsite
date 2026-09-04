const API_URL = '/api/visitor';

async function initVisitorCounter() {
  try {
    const response = await fetch(API_URL, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!sessionStorage.getItem('visited')) {
      sessionStorage.setItem('visited', 'true');
    }
    updateCounterDisplay(Number(data.views ?? 0));
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
