'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

type KpiRow = { day: string; otp_percent: number };
type IncRow = { type: string; count: number };

export default function Dashboard(){
  const [otpSeries, setOtpSeries] = useState<KpiRow[]>([]);
  const [incSeries, setIncSeries] = useState<IncRow[]>([]);

  useEffect(()=>{
    (async()=>{
      // OTP últimos 21 dias (média sobre todas as linhas)
      const { data: kpi } = await supabase.from('kpi_otp_by_line_day').select('day, otp_percent').order('day', { ascending: true }).limit(500);
      const grouped = (kpi||[]).reduce((acc:any, r:any)=>{
        const d = r.day?.slice(0,10);
        if (!d) return acc;
        acc[d] = acc[d] || { day: d, sum:0, n:0 };
        acc[d].sum += r.otp_percent || 0; acc[d].n += 1;
        return acc;
      }, {});
      const series = Object.values(grouped).map((g:any)=>({ day: g.day, otp_percent: +(g.sum / Math.max(1,g.n)).toFixed(1) })).slice(-21);
      setOtpSeries(series);

      // Incidentes por tipo, últimos 30 dias
      const since = new Date(Date.now() - 30*864e5).toISOString();
      const { data: inc } = await supabase.from('incidents').select('type').gte('occurred_at', since).limit(5000);
      const byType: Record<string, number> = {};
      (inc||[]).forEach((r:any)=>{ byType[r.type] = (byType[r.type]||0)+1; });
      setIncSeries(Object.entries(byType).map(([k,v])=>({ type:k, count:v })));
    })();
  }, []);

  return (
    <section className="grid">
      <div className="card">
        <div className="label">OTP — últimos 21 dias (média)</div>
        <LineChart width={600} height={260} data={otpSeries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0,100]} />
          <Tooltip />
          <Line type="monotone" dataKey="otp_percent" />
        </LineChart>
      </div>

      <div className="card">
        <div className="label">Incidentes por tipo — 30 dias</div>
        <BarChart width={600} height={260} data={incSeries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </div>
    </section>
  );
}
