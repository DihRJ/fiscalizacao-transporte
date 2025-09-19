'use client';
import React, { useEffect, useState } from 'react';
import { RoleGate } from '@/hooks/useRole';
import { authedFetch } from '@/lib/authedFetch';

type Row = { user_id: string, role: 'admin'|'supervisor'|'fiscal'|'auditor'|'controle', organization_id: string };

export default function AdminUsers(){
  const [rows, setRows] = useState<Row[]>([]);
  const [org, setOrg] = useState('');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState<Row>({ user_id:'', role:'fiscal', organization_id:'' });

  async function load(){
    const orgId = localStorage.getItem('organization_id')||'';
    setOrg(orgId);
    if (!orgId) return;
    const res = await authedFetch(`/api/admin/memberships?organization_id=${orgId}`);
    const j = await res.json();
    if (j.ok) setRows(j.data);
  }
  useEffect(()=>{ load(); }, []);

  async function createOrUpdate(mode:'create'|'update'){
    setMsg('Salvando...');
    const body = JSON.stringify({ ...form, organization_id: org });
    const res = await authedFetch('/api/admin/memberships', { method: mode==='create' ? 'POST':'PATCH', headers:{'Content-Type':'application/json'}, body });
    const j = await res.json();
    setMsg(j.ok ? 'OK' : ('Erro: '+j.error));
    await load();
  }

  async function remove(user_id:string){
    setMsg('Removendo...');
    const res = await authedFetch('/api/admin/memberships', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ organization_id: org, user_id }) });
    const j = await res.json();
    setMsg(j.ok ? 'OK' : ('Erro: '+j.error));
    await load();
  }

  return (
    <RoleGate allow={['admin','supervisor']}>
      <div>
        <h2>Usuários & Papéis</h2>
        {!org && <div className="card">Selecione uma organização no topo.</div>}
        {org && (
          <React.Fragment>
            <div className="card">
              <div className="label">Adicionar/Atualizar</div>
              <div style={{display:'grid', gap:8, gridTemplateColumns:'1fr 180px 180px 120px'}}>
                <input placeholder="user_id (auth.users.id)" value={form.user_id} onChange={e=>setForm({...form, user_id: e.target.value})} />
                <select value={form.role} onChange={e=>setForm({...form, role: e.target.value as Row['role']})}>
                  <option value="admin">admin</option>
                  <option value="supervisor">supervisor</option>
                  <option value="controle">controle</option>
                  <option value="fiscal">fiscal</option>
                  <option value="auditor">auditor</option>
                </select>
                <input type="datetime-local" placeholder="expira em (opcional)" onChange={e=>setForm({...form, organization_id: org })} />
                <div style={{display:'flex', gap:8}}>
                  <button className="btn" onClick={()=>createOrUpdate('create')}>Adicionar</button>
                  <button className="btn" onClick={()=>createOrUpdate('update')}>Atualizar</button>
                </div>
              </div>
              <div style={{marginTop:8, color:'#6b7280'}}>{msg}</div>
            </div>

            <div className="card" style={{marginTop:16}}>
              <div className="label">Membros</div>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead><tr><th style={{textAlign:'left'}}>user_id</th><th>Papel</th><th>Expira em</th><th>Ações</th></tr></thead>
                <tbody>
                  {rows.map(r=>(
                    <tr key={r.user_id}>
                      <td>{r.user_id}</td>
                      <td>{r.role}</td>
                      <td>-</td>
                      <td><button className="btn" onClick={()=>remove(r.user_id)}>Remover</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        )}
      </div>
    </RoleGate>
  );
}
