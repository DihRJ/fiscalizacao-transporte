'use client';
import { useState } from 'react';

export default function IncidentForm(){
  const [form, setForm] = useState({ organization_id:'', type:'quebra', severity:3, description:'' });
  const [msg, setMsg] = useState('');
  async function submit(e:any){
    e.preventDefault();
    const res = await fetch('/api/incidents', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    const j = await res.json();
    setMsg(j.ok ? 'Incidente criado' : ('Erro: '+j.error));
  }
  return (<form onSubmit={submit}>
    <h3>Novo Incidente</h3>
    <label>Org <input value={form.organization_id} onChange={e=>setForm({...form, organization_id:e.target.value})} /></label>
    <label>Tipo
      <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
        <option value="quebra">Quebra</option>
        <option value="acidente">Acidente</option>
        <option value="seguranca">Segurança</option>
        <option value="conduta">Conduta</option>
        <option value="lotacao">Lotação</option>
        <option value="parada_irregular">Parada Irregular</option>
        <option value="desvio">Desvio</option>
      </select>
    </label>
    <label>Gravidade (1-5) <input type="number" min={1} max={5} value={form.severity} onChange={e=>setForm({...form, severity: Number(e.target.value)})} /></label>
    <label>Descrição <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></label>
    <button className="btn" type="submit">Salvar</button>
    <div>{msg}</div>
  </form>);
}
