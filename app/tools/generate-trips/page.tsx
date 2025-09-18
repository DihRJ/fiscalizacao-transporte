'use client';
import { useEffect, useState } from 'react';
import { authedFetch } from '@/lib/authedFetch';

export default function Page(){
  const [org, setOrg] = useState('');
  const [start, setStart] = useState('2025-09-22');
  const [end, setEnd] = useState('2025-09-28');
  const [lineCodes, setLineCodes] = useState('501A,501B,501C,502,504A,505,508,510A,510B,510C,514,516,518,519,519B,520');
  const [vehicles, setVehicles] = useState('V001,V002,V003,V004,V005,V006,V007,V008,V009,V010');
  const [serviceConfig, setServiceConfig] = useState('');
  const [useDb, setUseDb] = useState(true);

  useEffect(()=>{
    const o = localStorage.getItem('organization_id')||'';
    setOrg(o);
    // preload service_config from sample files (static path not available); show default template for user to paste JSON (optional)
    setServiceConfig(JSON.stringify({
      defaults: { peak_headway_min: 15, offpeak_headway_min: 30, evening_headway_min: 30, weekend_headway_min: 30, duration_min: 45 },
      per_line: { "501A": { peak_headway_min: 10, offpeak_headway_min: 20, duration_min: 42 }, "510A": { duration_min: 38 }, "510B": { duration_min: 40 }, "510C": { duration_min: 35, circular: true } },
      calendar: { weekday: { blocks: [['06:00','09:00','peak'],['09:00','16:00','offpeak'],['16:00','19:00','peak'],['19:00','22:00','evening']] }, saturday: { blocks: [['07:00','22:00','weekend']] }, sunday: { blocks: [['07:00','22:00','weekend']] }, holiday: { blocks: [['07:00','21:00','weekend']] } },
      special_days: { '2025-09-24': 'holiday' }
    }, null, 2));
  },[]);

  async function generate(fmt:'csv'|'sql'){
    const body = {
      organization_id: org,
      start_date: start,
      end_date: end,
      line_codes: lineCodes.split(',').map(s=>s.trim()).filter(Boolean),
      vehicle_prefixes: vehicles.split(',').map(s=>s.trim()).filter(Boolean),
      service_config: serviceConfig ? JSON.parse(serviceConfig) : undefined
    };
    const endpoint = useDb ? '/api/tools/generate-trips/db?format='+fmt : '/api/tools/generate-trips?format='+fmt;
    const res = await authedFetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fmt === 'sql' ? 'trips_generated.sql' : 'trips_generated.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section>
      <h2>Gerador por Calendário</h2>
      <div className="card" style={{display:'grid', gap:12}}>
        <div><span className="label">Organização</span><input value={org} onChange={e=>setOrg(e.target.value)} placeholder="UUID" /></div>
        <div style={{display:'grid', gap:8, gridTemplateColumns:'1fr 1fr'}}>
          <div><span className="label">Início</span><input type="date" value={start} onChange={e=>setStart(e.target.value)} /></div>
          <div><span className="label">Fim</span><input type="date" value={end} onChange={e=>setEnd(e.target.value)} /></div>
        </div>
        <div><span className="label">Linhas (codes, separadas por vírgula)</span><input value={lineCodes} onChange={e=>setLineCodes(e.target.value)} /></div>
        <div><span className="label">Veículos (prefixos, separados por vírgula)</span><input value={vehicles} onChange={e=>setVehicles(e.target.value)} /></div>
        <div><span className="label">Service Config (JSON)</span><textarea rows={12} value={serviceConfig} onChange={e=>setServiceConfig(e.target.value)} /></div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <label><input type='checkbox' checked={useDb} onChange={e=>setUseDb(e.target.checked)} /> Usar banco (linhas/veículos da organização)</label>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn" onClick={()=>generate('csv')}>Gerar CSV</button>
          <button className="btn" onClick={()=>generate('sql')}>Gerar SQL</button>
        </div>
        <p style={{color:'#6b7280'}}>Dica: você pode usar `_SUPABASEbundle/service_config.json` e `_SUPABASEbundle/calendar_example.json` como base.</p>
      </div>
    </section>
  );
}
