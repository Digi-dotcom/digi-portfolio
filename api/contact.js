// Vercel serverless function. Secrets stay in server-side env vars; never in frontend code.
const hits = new Map(); // best-effort per-instance rate limit (use Upstash/Vercel KV for strict limits)
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return res.status(503).json({ ok: false, error: 'Contact service is not configured yet' });
  const ip = (req.headers['x-forwarded-for'] || 'x').split(',')[0], now = Date.now(), recent = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (recent.length >= 3) return res.status(429).json({ ok: false, error: 'Too many messages, try again later' });
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot: silently drop bots
  const name = String(b.name || '').trim(), email = String(b.email || '').trim(), msg = String(b.message || '').trim(), subj = String(b.subject || 'Other').slice(0, 60);
  if (!name || name.length > 100 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200 || msg.length < 10 || msg.length > 3000) return res.status(400).json({ ok: false, error: 'Invalid input' });
  recent.push(now); hits.set(ip, recent);
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL], reply_to: email, subject: `[Portfolio] ${subj} from ${name.replace(/[\r\n]/g, ' ')}`,
      html: `<p><b>${esc(name)}</b> &lt;${esc(email)}&gt;</p><p>${esc(msg).replace(/\n/g, '<br>')}</p>` }) }).catch(() => null);
  if (!r || !r.ok) return res.status(502).json({ ok: false, error: 'Email provider rejected the message' });
  res.status(200).json({ ok: true });
};
