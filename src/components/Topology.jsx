import { useState } from 'react';
import { P } from '../data/portfolio.js';
const { nodes, links } = P.topo, byId = Object.fromEntries(nodes.map(n => [n.id, n])), KINDS = ['All', ...new Set(nodes.map(n => n.kind))];
export default function Topology() {
  const [sel, setSel] = useState('fw'), [kind, setKind] = useState('All'), n = byId[sel], peers = links.filter(l => l.includes(sel)).map(l => byId[l.find(i => i !== sel)].l);
  const dim = x => kind !== 'All' && x.kind !== kind;
  return (<div className="lab">
    <div className="win tp"><div className="tools" role="group" aria-label="Filter nodes">{KINDS.map(k => <button key={k} className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{k}</button>)}</div>
      <svg viewBox="0 0 600 300" role="group" aria-label="Network diagram">
        {links.map(([a, b]) => <line key={a + b} x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y} className={a === sel || b === sel ? 'hl' : ''} />)}
        {nodes.map(x => <g key={x.id} className={`nd ${x.kind} ${x.id === sel ? 'sel' : ''} ${dim(x) ? 'dim' : ''}`} tabIndex={0} role="button" aria-pressed={x.id === sel} aria-label={`${x.l}: ${x.role}`}
          onClick={() => setSel(x.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(x.id); } }}>
          <rect x={x.x - 46} y={x.y - 24} width="92" height="48" rx="8" /><text x={x.x} y={x.y - 2}>{x.l}</text><text className="sub" x={x.x} y={x.y + 14}>{x.kind}</text></g>)}
      </svg></div>
    <div className="win ins" aria-live="polite"><div><span className="chip">{n.kind}</span></div><h3>{n.l}</h3><p>{n.role}</p>
      <dl><div><dt>VLAN</dt><dd>{n.vlan}</dd></div><div><dt>Services</dt><dd>{n.svc.join(', ') || 'None'}</dd></div><div><dt>Linked to</dt><dd>{peers.join(', ')}</dd></div></dl>
      {n.rules && <pre aria-label="Sample firewall rules">{n.rules.join('\n')}</pre>}</div></div>);
}
