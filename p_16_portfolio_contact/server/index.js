require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow cross-origin during dev; restrict in production
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// verify transporter on start
transporter.verify()
  .then(() => console.log('SMTP transporter ready'))
  .catch(err => {
    console.error('SMTP transporter error:', err.message || err);
  });

// small helper to escape HTML (avoid injection in mail body)
function escapeHtml(unsafe = '') {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Contact endpoint with validation
app.post('/api/contact', [
  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Message should be between 10 and 5000 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, message } = req.body;

  const htmlBody = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <hr />
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `;

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.MY_EMAIL || process.env.SMTP_USER,
    subject: `Portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: htmlBody
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Message sent', info });
  } catch (err) {
    console.error('sendMail error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Try again later.' });
  }
});

// fallback to serve index if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
