import { useEffect, useRef, useState } from 'react';
// Local, simulated traffic only. Nothing leaves the browser. Packets are drawn on a canvas.
const N = [['Internet', .12, .5], ['Firewall', .4, .5], ['Switch', .64, .5], ['Mgmt', .87, .17], ['Servers', .87, .5], ['Clients', .87, .83]];
const TARGETS = [4, 5], reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function PacketLab() {
  const cv = useRef(null), sim = useRef({ pk: [], fw: true, run: !reduce(), ddos: false, al: 0, bl: 0, log: [], last: 0, ui: 0, acc: 0 });
  const [ui, setUi] = useState({ fw: true, run: sim.current.run, ddos: false, al: 0, bl: 0, log: [] });
  const set = patch => { Object.assign(sim.current, patch); setUi(u => ({ ...u, ...patch })); };
  useEffect(() => {
    const c = cv.current, g = c.getContext('2d'), s = sim.current; let raf, W = 0, H = 0;
    const fit = () => { const d = devicePixelRatio || 1, r = c.getBoundingClientRect(); W = r.width; H = r.height; c.width = W * d; c.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); };
    const ro = new ResizeObserver(fit); ro.observe(c); fit();
    const pt = i => [N[i][1] * W, N[i][2] * H];
    const draw = () => {
      const cs = getComputedStyle(document.documentElement), v = k => cs.getPropertyValue(k).trim();
      g.clearRect(0, 0, W, H); g.lineWidth = 2; g.font = '600 12px JetBrains Mono, monospace'; g.textAlign = 'center';
      [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5]].forEach(([a, b]) => { g.strokeStyle = v('--line'); g.beginPath(); g.moveTo(...pt(a)); g.lineTo(...pt(b)); g.stroke(); });
      s.pk.forEach(p => { const seg = Math.min(Math.floor(p.p), p.r.length - 2), f = p.p - seg, a = pt(p.r[seg]), b = pt(p.r[seg + 1]), x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
        g.globalAlpha = p.dead ? Math.max(0, 1 - p.dead * 2.5) : 1; g.fillStyle = p.bad ? v('--err') : v('--ok'); g.fillRect(x - 4, y - 4, 8, 8); g.globalAlpha = 1; });
      N.forEach((n, i) => { const [x, y] = pt(i), w = Math.min(84, W * .17), fwn = i === 1; g.fillStyle = v('--bg'); g.strokeStyle = fwn ? (s.fw ? v('--teal') : v('--yellow')) : v('--purple'); g.setLineDash(fwn && !s.fw ? [5, 4] : []);
        g.beginPath(); g.roundRect(x - w / 2, y - 18, w, 36, 6); g.fill(); g.stroke(); g.setLineDash([]); g.fillStyle = v('--text'); g.fillText(n[0], x, y + 4); });
    };
    const tick = t => {
      const dt = Math.min(.05, (t - (s.last || t)) / 1000); s.last = t;
      if (s.run) {
        s.acc += dt * (s.ddos ? 16 : 1.8); while (s.acc >= 1 && s.pk.length < 140) { s.acc--; const bad = Math.random() < (s.ddos ? .75 : .25), tg = TARGETS[Math.random() * 2 | 0]; s.pk.push({ p: 0, r: [0, 1, 2, tg], bad, dead: 0, id: Math.random().toString(16).slice(2, 6) }); }
        s.pk.forEach(p => { if (p.dead) { p.dead += dt; return; } const was = p.p; p.p += dt * (s.ddos ? .55 : .4);
          if (was < 1 && p.p >= 1) { if (p.bad && s.fw) { p.dead = .01; s.bl++; s.log = [`DENY  tcp/${p.bad ? 23 : 443} from 203.0.113.${p.id.charCodeAt(0) % 200} (simulated)`, ...s.log].slice(0, 3); } else if (!p.bad) { s.al++; if (Math.random() < .3) s.log = [`ALLOW tcp/443 to ${N[p.r[3]][0]}`, ...s.log].slice(0, 3); } }
          if (p.p >= p.r.length - 1) p.dead = p.dead || .5; });
        s.pk = s.pk.filter(p => p.dead < .4 || (p.dead === 0)); s.pk = s.pk.filter(p => !(p.dead >= .4));
      }
      if (t - s.ui > 250) { s.ui = t; setUi(u => ({ ...u, al: s.al, bl: s.bl, log: s.log })); }
      draw(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick); return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  const reset = () => { Object.assign(sim.current, { pk: [], al: 0, bl: 0, log: [], ddos: false, acc: 0 }); setUi(u => ({ ...u, ddos: false, al: 0, bl: 0, log: [] })); };
  return (<>
    <div className="pane"><canvas ref={cv} aria-hidden="true" /></div>
    <div className="ctl" role="group" aria-label="Simulation controls">
      <button className="chip" aria-pressed={ui.run} onClick={() => set({ run: !ui.run })}>{ui.run ? 'Pause' : 'Run'}</button>
      <button className="chip" aria-pressed={ui.fw} onClick={() => set({ fw: !ui.fw })}>Firewall {ui.fw ? 'on' : 'off'}</button>
      <button className="chip" aria-pressed={ui.ddos} onClick={() => set({ ddos: !ui.ddos, run: true })}>Flood test</button>
      <button className="chip" onClick={reset}>Reset</button>
      <span className="st" role="status">allowed {ui.al} · blocked {ui.bl}</span></div>
    <div className="lg" aria-label="Event log">{ui.log.length ? ui.log.map((l, i) => <div key={i}>{l.startsWith('ALLOW') ? <b>{l}</b> : <em>{l}</em>}</div>) : <span>Simulation only. No real traffic is sent. {ui.run ? '' : 'Press Run to start.'}</span>}</div>
  </>);
}
