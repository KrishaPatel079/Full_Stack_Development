const form = document.getElementById('contactForm');
const feedback = document.getElementById('feedback');
const submitBtn = document.getElementById('submitBtn');

function showMessage(text, isError = false) {
  feedback.textContent = text;
  feedback.className = isError ? 'feedback error' : 'feedback success';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage('', false);

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Basic client validation
  if (name.length < 2) return showMessage('Name must be at least 2 characters', true);
  if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Please enter a valid email', true);
  if (message.length < 10) return showMessage('Message must be at least 10 characters', true);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showMessage('Thanks — your message was sent!');
      form.reset();
    } else {
      // show validation errors if present
      if (data && data.errors && Array.isArray(data.errors)) {
        showMessage(data.errors.map(e => e.msg).join(' • '), true);
      } else if (data && data.message) {
        showMessage(data.message, true);
      } else {
        showMessage('Failed to send message. Please try again later.', true);
      }
    }
  } catch (err) {
    console.error(err);
    showMessage('Network error. Check your connection and try again.', true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});
