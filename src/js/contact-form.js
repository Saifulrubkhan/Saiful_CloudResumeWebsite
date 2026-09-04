const API_URL = 'https://scnea4v1hj.execute-api.us-east-1.amazonaws.com/contact';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = document.getElementById('company');
    if (honeypot && honeypot.value !== '') return;

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    status.textContent = 'Sending...';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      status.textContent = 'Message sent successfully!';
      form.reset();
    } catch (err) {
      console.error('Contact form error:', err);
      status.textContent = `Error sending message: ${err.message}`;
    }
  });
});
