'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Trips() {
  const [trips, setTrips] = useState<any[]>([]);
  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from('trips').select('*').limit(50);
      setTrips(data||[]);
    })();
  },[]);
  return (
    <section>
      <h2>Viagens Programadas</h2>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th>Linha</th><th>Partida</th><th>Chegada</th><th>Bloco</th><th>Turno</th></tr></thead>
        <tbody>
          {trips.map(t=>(
            <tr key={t.id}>
              <td>{t.line_id}</td>
              <td>{t.planned_departure}</td>
              <td>{t.planned_arrival}</td>
              <td>{t.block_code}</td>
              <td>{t.shift}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
