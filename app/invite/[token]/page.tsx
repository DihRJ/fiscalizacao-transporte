'use client';
import { useEffect, useState } from 'react';
import { authedFetch } from '@/lib/authedFetch';

export default function Page({ params }:{ params: { token: string }}){
  const [msg, setMsg] = useState('Processando convite...');
  useEffect(()=>{
    (async()=>{
      const res = await authedFetch('/api/admin/invitations', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token: params.token }) });
      const j = await res.json();
      setMsg(j.ok ? 'Convite aceito! Você já tem acesso à organização.' : ('Erro: '+j.error));
    })();
  }, [params.token]);
  return (<div className="card"><div>{msg}</div></div>);
}
