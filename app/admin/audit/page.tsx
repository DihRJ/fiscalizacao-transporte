'use client';
import { useEffect, useState } from 'react';
import { RoleGate } from '@/hooks/useRole';
import { authedFetch } from '@/lib/authedFetch';

type Row = { created_at: string, user_id: string|null, action: string, entity: string|null, entity_id: string|null, summary: any };

export default function AuditPage(){
  const [rows, setRows] = useState<Row[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState('');

  async function load(){
    const orgId = localStorage.getItem('organization_id')||'';
    setOrg(orgId);
    if (!orgId) return;
    setLoading(true);
    const url = new URL(window.location.origin + '/api/admin/audit');
    url.searchParams.set('organization_id', orgId);
    if (start) url.searchParams.set('start', new Date(start).toISOString());
    if (end) url.searchParams.set('end', new Date(end).toISOString());
    const res = await authedFetch(url.toString());
    const j = await res.json();
    setRows(j.data||[]);
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  return (
    <RoleGate allow={['admin','supervisor','auditor']}>
      <div>
        <h2>Auditoria</h2>
        {!org && <div className="card">Selecione uma organização no topo.</div>}
        {org && (
          <div className="card">
            <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
              <div><span className="label">Início</span><input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} /></div>
              <div><span className="label">Fim</span><input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} /></div>
              <button className="btn" onClick={load}>Filtrar</button>
            </div>
            {loading ? <div>Carregando...</div> : (
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead><tr><th>Data</th><th>User</th><th>Ação</th><th>Entidade</th><th>ID</th><th>Resumo</th></tr></thead>
                <tbody>
                  {rows.map((r,i)=>(
                    <tr key={i}>
                      <td>{new Date(r.created_at).toLocaleString()}</td>
                      <td>{r.user_id||'-'}</td>
                      <td>{r.action}</td>
                      <td>{r.entity||'-'}</td>
                      <td>{r.entity_id||'-'}</td>
                      <td><pre style={{whiteSpace:'pre-wrap', margin:0}}>{typeof r.summary === 'string' ? r.summary : JSON.stringify(r.summary)}</pre></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </RoleGate>
  );
}
