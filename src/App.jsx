import { useEffect, useMemo, useState } from 'react';
import { P } from './data/portfolio.js';
import PacketLab from './components/PacketLab.jsx'; import Terminal from './components/Terminal.jsx'; import Topology from './components/Topology.jsx'; import Contact from './components/Contact.jsx';
const ls = { get: k => { try { return localStorage.getItem(k) } catch { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch { } } };
const I = { sun: 'M12 4V2m0 20v-2M4 12H2m20 0h-2m-2.9-7.1 1.4-1.4M5.5 18.5l1.4-1.4m0-10.2L5.5 5.5m13 13-1.4-1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10', scan: 'M3 5h18v11H3zM8 20h8M12 16v4', menu: 'M4 7h16M4 12h16M4 17h16' };
const Ico = ({ d }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={d} /></svg>;
const SH = ({ id, t, p }) => <div className="sh"><h2 id={id}>{t}</h2>{p && <p>{p}</p>}</div>;
const RobotArt = () => <svg viewBox="0 0 320 220" role="img" aria-label="Diagram of a robot with ultrasonic sensor beams">
  <g fill="none" stroke="var(--teal)" strokeWidth="2"><path d="M168 78q50-18 100 0M168 78q60-34 120 0" opacity=".6" /><path d="M168 78q-50-18-100 0M168 78q-60-34-120 0" opacity=".6" /></g>
  <rect x="118" y="86" width="100" height="70" rx="8" fill="var(--s2)" stroke="var(--purple)" strokeWidth="3" /><circle cx="143" cy="96" r="9" fill="var(--bg)" stroke="var(--teal)" strokeWidth="2" /><circle cx="193" cy="96" r="9" fill="var(--bg)" stroke="var(--teal)" strokeWidth="2" />
  <rect x="100" y="140" width="22" height="36" rx="4" fill="var(--bg)" stroke="var(--yellow)" strokeWidth="2" /><rect x="214" y="140" width="22" height="36" rx="4" fill="var(--bg)" stroke="var(--yellow)" strokeWidth="2" />
  <rect x="150" y="116" width="36" height="8" fill="var(--teal)" /><rect x="262" y="40" width="26" height="26" fill="var(--err)" opacity=".8" /></svg>;
const Badge = ({ i }) => <svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" fill="var(--s2)" stroke={['var(--teal)', 'var(--purple)', 'var(--yellow)', 'var(--ok)'][i % 4]} strokeWidth="3" /><path d="M12 24l7 7 13-14" fill="none" stroke="var(--text)" strokeWidth="3" /></svg>;
export default function App() {
  const [theme, setTheme] = useState(ls.get('theme') || 'dark'), [crt, setCrt] = useState(ls.get('crt') !== 'false');
  const [mode, setMode] = useState('gui'), [open, setOpen] = useState(false), [cat, setCat] = useState('All'), [q, setQ] = useState(''), [toast, setToast] = useState('');
  useEffect(() => { document.documentElement.dataset.theme = theme; ls.set('theme', theme); }, [theme]);
  useEffect(() => { document.body.classList.toggle('crt', crt); ls.set('crt', crt); }, [crt]);
  const flip = () => { const n = theme === 'dark' ? 'light' : 'dark'; setTheme(n); return n; };
  const party = () => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; document.body.classList.add('party'); setTimeout(() => document.body.classList.remove('party'), 2500); };
  const unlock = () => { setToast('Badge unlocked: Curious Packet'); setTimeout(() => setToast(''), 4000); };
  const cats = ['All', ...new Set(P.projects.map(p => p.cat))], list = useMemo(() => P.projects.filter(p => (cat === 'All' || p.cat === cat) && (p.title + p.about + p.tech.join(' ')).toLowerCase().includes(q.toLowerCase())), [cat, q]);
  const feat = list.find(p => p.title.startsWith('IoT')), rest = list.filter(p => p !== feat);
  const links = [['about', 'About'], ['skills', 'Skills'], ['lab', 'Lab'], ['projects', 'Projects'], ['credentials', 'Credentials'], ['contact', 'Contact']];
  return (<>
    <header><div className={`wrap nav ${open ? 'open' : ''}`}><a className="brand" href="#top"><i />digi.sh</a>
      {links.map(([h, t]) => <a key={h} className="l" href={`#${h}`} onClick={() => setOpen(false)}>{t}</a>)}
      <button className="tb" aria-pressed={theme === 'light'} onClick={flip} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Ico d={I.sun} /></button>
      <button className="tb" aria-pressed={crt} onClick={() => setCrt(!crt)} aria-label="Toggle scanlines"><Ico d={I.scan} /></button>
      <button className="tb menu" aria-expanded={open} onClick={() => setOpen(!open)} aria-label="Menu"><Ico d={I.menu} /></button></div></header>
    <main id="top">
      <section className="hero"><div className="wrap hg">
        <div><p className="in"><span className="status"><i className="dot" />IT Intern, NOC · Islington College</span></p>
          <h1 className="in" aria-label={P.name.join(' ')}>{P.name.map(n => <span key={n}>{n}</span>)}</h1>
          <p className="in sub">Networking and IT security student in {P.location.split(',')[0]}.</p>
          <p className="in lead">{P.intro}</p>
          <div className="in cta"><a className="btn pri" href="#projects">Explore my projects</a><a className="btn" href={P.cv.href} download={P.cv.file}>Download CV</a><a className="btn" href="#contact">Contact me</a></div></div>
        <div className="win in" style={{ animation: 'up .7s .2s var(--ease) forwards', opacity: 0 }}>
          <div className="bar"><div className="lights"><i /><i /><i /></div><span className="mono mute" style={{ fontSize: '.8rem' }}>{mode === 'gui' ? 'traffic.sim' : 'digi@lab'}</span>
            <div className="seg" role="tablist" aria-label="Interface mode"><button role="tab" aria-selected={mode === 'gui'} onClick={() => setMode('gui')}>GUI</button><button role="tab" aria-selected={mode === 'cli'} onClick={() => setMode('cli')}>CLI</button></div></div>
          {mode === 'gui' ? <PacketLab /> : <div className="pane"><Terminal onTheme={flip} onExit={() => setMode('gui')} onParty={party} onUnlock={unlock} /></div>}
        </div></div></section>
      <section id="about-s"><div className="wrap"><div className="about"><div><h2 id="about" className="pull">I want to understand networks well enough to defend them.</h2>
        <p>{P.intro}</p><p>My coursework covers routing and switching, security fundamentals and programming. Outside class I build small projects and finish short industry courses to fill the gaps.</p></div>
        <dl>{P.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div></div></section>
      <section id="skills-s"><div className="wrap"><SH id="skills" t="Skills" p="Split by what I already use and what I am still learning." />
        <div className="sk">{P.skills.map(([g, u, l]) => <div className="skr" key={g}><h3>{g}</h3><div className="chips">{u.map(x => <span className="chip used" key={x}>{x}</span>)}{l.map(x => <span className="chip learn" key={x}>{x} (learning)</span>)}</div></div>)}</div></div></section>
      <section id="lab-s"><div className="wrap"><SH id="lab" t="Network lab" p="A segmented network, from the internet to the user VLANs. Select a node to inspect it." />
        <p className="note">Illustrative design. This is not a live homelab.</p><Topology /></div></section>
      <section id="projects-s"><div className="wrap"><SH id="projects" t="Projects" p="Coursework and personal builds from 2026." />
        <div className="tools"><input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects" aria-label="Search projects" />{cats.map(c => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
        {feat && <article className="win feat"><div className="thumb"><RobotArt /></div><div className="fb"><div className="meta"><span>{feat.status}</span><span>{feat.when}</span><span>Role: {feat.role}</span></div><h3>{feat.title}</h3><p className="mute">{feat.about}</p><div className="chips">{feat.tech.map(t => <span className="chip" key={t}>{t}</span>)}</div></div></article>}
        <div className="pl">{rest.map(p => <article className="pr" key={p.title}><span className="mono">{p.when}</span><div><h3>{p.title}</h3><p>{p.about}</p></div>{p.repo ? <a className="btn" href={p.repo} rel="noopener">Source code</a> : <span className="mono mute">No repo</span>}</article>)}</div>
        {!list.length && <p className="empty">No projects match. Clear the search or pick another category.</p>}</div></section>
      <section id="credentials-s"><div className="wrap"><SH id="credentials" t="Experience and credentials" />
        <div className="cr"><div><h3>Experience and education</h3><ul className="tl">{[...P.experience, ...P.education].map(e => <li key={e[0]}><b>{e[0]}</b><span>{e[1]}</span>{e[2] && <span className="mono">{e[2]}</span>}</li>)}</ul></div>
          <div><h3>Certifications</h3>{P.certs.map((c, i) => <div className="win cb" key={c[0]}><Badge i={i} /><div><b>{c[0]}</b><span>{c[1]} · {c[2]}</span></div></div>)}</div></div></div></section>
      <section id="contact-s"><div className="wrap"><SH id="contact" t="Get in touch" /><Contact /></div></section>
    </main>
    <footer><div className="wrap"><div className="fg"><div><b className="brand" style={{ fontSize: '1.2rem' }}><i />{P.name.join(' ')}</b><p className="mute" style={{ marginTop: '.75rem', maxWidth: '38ch' }}>{P.headline}. {P.location}.</p></div>
      <div><h4>Explore</h4><ul>{links.map(([h, t]) => <li key={h}><a href={`#${h}`}>{t}</a></li>)}</ul></div>
      <div><h4>Elsewhere</h4><ul><li><a href={`mailto:${P.email}`}>Email</a></li><li><a href={`https://github.com/${P.github}`} rel="noopener">GitHub</a></li><li><a href={P.linkedin} rel="noopener">LinkedIn</a></li><li><a href={P.cv.href} download={P.cv.file}>CV (PDF)</a></li></ul></div></div>
      <p className="fine">© {new Date().getFullYear()} {P.name.join(' ')}. Traffic simulations run locally in your browser.</p></div></footer>
    {toast && <div className="toast" role="status">{toast}</div>}
  </>);
}
