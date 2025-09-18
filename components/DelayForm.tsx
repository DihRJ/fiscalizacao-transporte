'use client';
import { useState } from 'react';

export default function DelayForm({ tripId }:{tripId?:string}){
  const [body, setBody] = useState({ actual_departure:'', reason_code:'', note:'' });
  const [msg, setMsg] = useState<string>('');
  async function submit(e: any){
    e.preventDefault();
    const res = await fetch(`/api/trip-events/${tripId||'unknown'}/departure`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const j = await res.json();
    setMsg(j.ok ? 'Registro salvo' : ('Erro: '+j.error));
  }
  return (<form onSubmit={submit}>
    <h3>Registrar Atraso / Partida</h3>
    <label>Partida Real (ISO) <input value={body.actual_departure} onChange={e=>setBody({...body, actual_departure:e.target.value})} placeholder="2025-09-19T06:05:00-03:00" /></label>
    <label>Motivo <input value={body.reason_code} onChange={e=>setBody({...body, reason_code:e.target.value})} /></label>
    <label>Observação <textarea value={body.note} onChange={e=>setBody({...body, note:e.target.value})}/></label>
    <button className="btn" type="submit">Salvar</button>
    <div>{msg}</div>
  </form>);
}
