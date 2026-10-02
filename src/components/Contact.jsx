import { useState } from 'react';
import { P } from '../data/portfolio.js';
// Success is shown only when the server confirms the provider accepted the message.
export default function Contact() {
  const [s, setS] = useState({ busy: false, err: null, ok: false });
  const send = async e => { e.preventDefault(); const f = e.currentTarget, d = Object.fromEntries(new FormData(f)); setS({ busy: false, err: null, ok: false });
    if (!d.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) || d.message.trim().length < 10) return setS({ busy: false, ok: false, bad: 'Enter your name, a valid email, and a message of at least 10 characters.' });
    setS({ busy: true, err: null, ok: false });
    try { const r = await fetch(import.meta.env?.VITE_CONTACT_URL || '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }), j = await r.json().catch(() => ({})); if (!r.ok || !j.ok) throw new Error(j.error || 'Server error'); f.reset(); setS({ busy: false, err: null, ok: true }); }
    catch (x) { setS({ busy: false, ok: false, err: x.message }); } };
  return (<div className="ct"><div><p className="mute">Email is the quickest way to reach me. I read every message.</p><a className="big" href={`mailto:${P.email}`}>{P.email}</a>
    <div className="cta"><a className="btn" href={`https://github.com/${P.github}`} rel="noopener">GitHub</a><a className="btn" href={P.linkedin} rel="noopener">LinkedIn</a></div></div>
    <form className="win f" onSubmit={send} noValidate>
      <label>Name<input name="name" required maxLength="100" autoComplete="name" /></label><label>Email<input name="email" type="email" required maxLength="200" autoComplete="email" /></label>
      <label>Subject<select name="subject"><option>Opportunity</option><option>Project question</option><option>Collaboration</option><option>Other</option></select></label>
      <label>Message<textarea name="message" rows="5" required maxLength="3000" /></label>
      <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
      <div className="msg e" role="alert">{s.bad}{s.err && <>Could not send: {s.err}. Please email me directly at <a href={`mailto:${P.email}`}>{P.email}</a>.</>}</div>
      <div className="msg o" role="status">{s.ok && 'Message accepted for delivery. I will reply by email.'}</div>
      <button className="btn pri" disabled={s.busy}>{s.busy ? 'Sending' : 'Send message'}</button></form></div>);
}
