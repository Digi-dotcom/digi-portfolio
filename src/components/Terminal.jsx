import { useEffect, useRef, useState } from 'react';
import { P } from '../data/portfolio.js';
const FLAG = 'CTF{you_found_the_secret}', mail = `mailto:${P.email}`, gh = `https://github.com/${P.github}`;
// Simulated terminal: input is matched against a fixed command table and never evaluated.
export default function Terminal({ onTheme, onExit, onParty, onUnlock }) {
  const [lines, setLines] = useState([{ t: "Simulated terminal. Type 'help'. Nothing you type is executed." }]);
  const [val, setVal] = useState(''), hist = useRef([]), hi = useRef(0), box = useRef(null), inp = useRef(null);
  useEffect(() => { box.current.scrollTop = 1e9; }, [lines]);
  const add = (...l) => setLines(o => [...o, ...l]);
  const cmds = {
    help: () => add({ t: 'help about whoami skills "ping skills" projects experience education certifications github contact resume clear date "run party" matrix theme exit hint flag' }),
    about: () => add({ t: P.intro }), whoami: () => add({ t: `${P.name.join(' ')}: ${P.headline}, ${P.location}` }),
    skills: () => add(...P.skills.map(([g, u, l]) => ({ t: `${g}: ${u.join(', ')}${l.length ? ' | learning: ' + l.join(', ') : ''}` }))),
    'ping skills': () => add({ t: 'PING skills (simulated, no packets sent)' }, ...P.skills.map(([g, u, l]) => ({ t: `reply from ${g.toLowerCase()}: ${u.length} used, ${l.length} learning` }))),
    projects: () => add(...P.projects.map(p => ({ t: `[${p.status}] ${p.title}: ${p.about}` }))),
    experience: () => add(...P.experience.map(e => ({ t: `${e[0]}, ${e[1]} (${e[2]})` }))), education: () => add(...P.education.map(e => ({ t: `${e[0]}, ${e[1]}` }))),
    certifications: () => add(...P.certs.map(c => ({ t: `${c[0]}, ${c[1]} (${c[2]})` }))),
    github: () => add({ t: 'GitHub:', href: gh, a: gh }), contact: () => add({ t: 'Email:', href: mail, a: P.email }, { t: 'Or use the form:', href: '#contact', a: 'contact section' }),
    resume: () => add({ t: 'CV:', href: P.cv.href, a: 'download PDF', dl: P.cv.file }), clear: () => setLines([]), date: () => add({ t: new Date().toString() }),
    exit: () => onExit(), theme: () => add({ t: 'Theme: ' + onTheme() }), 'run party': () => { onParty(); add({ t: 'Party mode (skipped if you prefer reduced motion).' }); },
    matrix: () => add(...Array.from({ length: 5 }, () => ({ t: Array.from({ length: 36 }, () => Math.random() < .5 ? 0 : 1).join(' ') }))),
    hint: () => add({ t: 'Flags look like CTF{...}. Clues hide in the browser console. Submit with: flag <value>' })
  };
  const run = e => { e.preventDefault(); const raw = val.trim(), c = raw.toLowerCase(); setVal(''); if (!raw) return; hist.current.push(raw); hi.current = hist.current.length; add({ t: '$ ' + raw });
    if (c.startsWith('flag ')) { if (raw.slice(5).trim() === FLAG) { add({ t: 'Correct. Badge unlocked: Curious Packet.' }); onUnlock(); } else add({ t: 'Incorrect flag.' }); }
    else if (cmds[c]) cmds[c](); else { const near = Object.keys(cmds).find(k => k.startsWith(c.split(' ')[0])); add({ t: `Unknown command '${raw.slice(0, 40)}'.${near ? ` Did you mean '${near}'?` : ''} Type 'help'.` }); } };
  const key = e => { if (e.key === 'ArrowUp' && hi.current > 0) { setVal(hist.current[--hi.current]); e.preventDefault(); } if (e.key === 'ArrowDown') { hi.current = Math.min(hi.current + 1, hist.current.length); setVal(hist.current[hi.current] || ''); e.preventDefault(); } };
  useEffect(() => { inp.current.focus({ preventScroll: true }); }, []);
  return (<div className="term" onClick={() => inp.current.focus({ preventScroll: true })}>
    <div className="tout" ref={box} role="log" aria-live="polite">{lines.map((l, i) => <div key={i}>{l.t}{l.href && <> <a href={l.href} {...(l.dl ? { download: l.dl } : {})}>{l.a}</a></>}</div>)}</div>
    <form onSubmit={run}><span aria-hidden="true">$</span><input ref={inp} value={val} onChange={e => setVal(e.target.value)} onKeyDown={key} aria-label="Terminal command" autoComplete="off" autoCapitalize="off" spellCheck="false" /></form></div>);
}
