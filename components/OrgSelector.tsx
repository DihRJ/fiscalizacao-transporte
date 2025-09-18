'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function OrgSelector(){
  const [orgs, setOrgs] = useState<{id:string,name:string}[]>([]);
  const [org, setOrg] = useState<string>('');

  useEffect(()=>{
    (async()=>{
      const { data: mem } = await supabase.from('memberships').select('organization_id, organizations!inner(id,name)').limit(50);
      const list = (mem||[]).map((m:any)=>({id:m.organizations.id, name:m.organizations.name}));
      setOrgs(list);
      const saved = localStorage.getItem('organization_id');
      if (saved) setOrg(saved);
    })();
  },[]);

  function choose(id:string){
    setOrg(id);
    localStorage.setItem('organization_id', id);
  }

  return (<div style={{display:'flex', gap:8, alignItems:'center'}}>
    <span className="label">Organização:</span>
    <select value={org} onChange={e=>choose(e.target.value)}>
      <option value="">(selecione)</option>
      {orgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  </div>);
}
