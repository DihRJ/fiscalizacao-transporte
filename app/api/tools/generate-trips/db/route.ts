import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type ServiceConfig = {
  defaults: { peak_headway_min:number; offpeak_headway_min:number; evening_headway_min:number; weekend_headway_min:number; duration_min:number; };
  per_line?: Record<string, Partial<{ peak_headway_min:number; offpeak_headway_min:number; evening_headway_min:number; weekend_headway_min:number; duration_min:number; circular:boolean }>>;
  calendar: Record<string, { blocks: [string,string,string][] }>;
  special_days?: Record<string, string>;
};

function parseTime(t: string){ const [h,m] = t.split(':').map(x=>parseInt(x,10)); return { h, m }; }
function* timeRange(dateISO: string, start: string, end: string, stepMin: number){
  const d = new Date(dateISO + 'T00:00:00-03:00');
  const { h:sh, m:sm } = parseTime(start);
  const { h:eh, m:em } = parseTime(end);
  const startDt = new Date(d); startDt.setHours(sh, sm, 0, 0);
  const endDt = new Date(d); endDt.setHours(eh, em, 0, 0);
  for (let t = startDt; t <= endDt; t = new Date(t.getTime() + stepMin*60000)) yield t;
}
function headwayFor(cfg: ServiceConfig, line: string, period: string){
  const per = (cfg.per_line && cfg.per_line[line]) || {};
  const d = cfg.defaults;
  if (period === 'peak') return per.peak_headway_min ?? d.peak_headway_min;
  if (period === 'offpeak') return per.offpeak_headway_min ?? d.offpeak_headway_min;
  if (period === 'evening') return per.evening_headway_min ?? d.evening_headway_min;
  if (period === 'weekend') return per.weekend_headway_min ?? d.weekend_headway_min;
  return d.offpeak_headway_min;
}
function durationFor(cfg: ServiceConfig, line: string){
  const per = (cfg.per_line && cfg.per_line[line]) || {};
  return per.duration_min ?? cfg.defaults.duration_min;
}
function isCircular(cfg: ServiceConfig, line: string){
  const per = (cfg.per_line && cfg.per_line[line]) || {};
  return !!per.circular;
}
function blockCode(period: string, circular: boolean){
  const base = period === 'peak' ? 'B1' : period === 'offpeak' ? 'B2' : period === 'evening' ? 'B3' : 'B5';
  return base + (circular ? 'C' : '');
}
function shiftName(period: string){
  return period === 'peak' ? 'pico' : period === 'offpeak' ? 'entrepico' : period === 'evening' ? 'noite' : 'fds';
}

export async function POST(req: NextRequest){
  try{
    const format = (new URL(req.url).searchParams.get('format') || 'csv').toLowerCase();
    const body = await req.json();
    const { organization_id, start_date, end_date, service_config } = body || {};
    await requireRole(req, organization_id, ['supervisor','admin']);
    if (!organization_id || !start_date || !end_date){
      return new Response(JSON.stringify({ ok:false, error:'organization_id, start_date e end_date são obrigatórios' }), { status: 400 });
    }
    const cfg: ServiceConfig = service_config || {
      defaults: { peak_headway_min: 15, offpeak_headway_min: 30, evening_headway_min: 30, weekend_headway_min: 30, duration_min: 45 },
      per_line: {},
      calendar: { weekday:{ blocks:[['06:00','09:00','peak'],['09:00','16:00','offpeak'],['16:00','19:00','peak'],['19:00','22:00','evening']] }, saturday:{ blocks:[['07:00','22:00','weekend']] }, sunday:{ blocks:[['07:00','22:00','weekend']] } },
      special_days: {}
    };

    // DB reads
    const admin = supabaseAdmin();
    const { data: linesRes, error: lerr } = await admin.from('lines').select('code').eq('organization_id', organization_id).eq('active', true).order('code', { ascending: true });
    if (lerr) return new Response(JSON.stringify({ ok:false, error: 'lines query: '+lerr.message }), { status: 400 });
    const lineCodes = (linesRes||[]).map((r:any)=>r.code);
    if (!lineCodes.length) return new Response(JSON.stringify({ ok:false, error:'Nenhuma linha ativa encontrada' }), { status: 400 });

    const { data: vehRes, error: verr } = await admin.from('vehicles').select('prefix').eq('organization_id', organization_id).order('prefix', { ascending: true });
    if (verr) return new Response(JSON.stringify({ ok:false, error: 'vehicles query: '+verr.message }), { status: 400 });
    const vehiclePrefixes = (vehRes||[]).map((r:any)=>r.prefix);
    if (!vehiclePrefixes.length) return new Response(JSON.stringify({ ok:false, error:'Nenhum veículo encontrado' }), { status: 400 });

    function dayType(dateStr: string){
      const override = cfg.special_days && (cfg.special_days as any)[dateStr];
      if (override) return override;
      const d = new Date(dateStr + 'T00:00:00Z');
      const wd = d.getUTCDay();
      return wd===0 ? 'sunday' : wd===6 ? 'saturday' : 'weekday';
    }

    const rows: any[] = [];
    let vehIdx = 0;
    const start = new Date(start_date + 'T00:00:00-03:00');
    const end = new Date(end_date + 'T00:00:00-03:00');
    for (let t = new Date(start); t <= end; t = new Date(t.getTime() + 86400000)){
      const dateStr = t.toISOString().slice(0,10);
      const typ = dayType(dateStr);
      const def = (cfg.calendar as any)[typ] || (cfg.calendar as any)['sunday'];
      const blocks = def.blocks || [];
      for (const code of lineCodes){
        const circ = isCircular(cfg, code);
        for (const [startH, endH, period] of blocks as any){
          const step = headwayFor(cfg, code, period);
          for (const dep of timeRange(dateStr, startH, endH, step)){
            const arr = new Date(dep.getTime() + durationFor(cfg, code)*60000);
            rows.push({
              organization_id, line_code: code,
              planned_vehicle_prefix: vehiclePrefixes[vehIdx % vehiclePrefixes.length],
              planned_departure: new Date(dep.getTime()).toISOString().replace('Z','-03:00'),
              planned_arrival: new Date(arr.getTime()).toISOString().replace('Z','-03:00'),
              block_code: blockCode(period, circ),
              shift: shiftName(period)
            });
            vehIdx++;
          }
        }
      }
    }

    if (format === 'sql'){
      const parts: string[] = [];
      parts.push("-- generated by /api/tools/generate-trips/db");
      parts.push("DO $$ DECLARE org uuid := '" + organization_id + "'; BEGIN");
      for (const r of rows){
        parts.push(`  INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
  SELECT org,
    (SELECT id FROM lines WHERE organization_id=org AND code='${r.line_code}' LIMIT 1),
    (SELECT id FROM vehicles WHERE organization_id=org AND prefix='${r.planned_vehicle_prefix}' LIMIT 1),
    '${r.planned_departure}'::timestamptz,
    '${r.planned_arrival}'::timestamptz,
    '${r.block_code}', '${r.shift}'
  ON CONFLICT DO NOTHING;`);
      }
      parts.push("END $$;");
      const sql = parts.join("\n");
      return new Response(sql, { status: 200, headers: { 'Content-Type': 'application/sql; charset=utf-8', 'Content-Disposition': 'attachment; filename="trips_generated_db.sql"' } });
    } else {
      const header = "organization_id,line_code,planned_vehicle_prefix,planned_departure,planned_arrival,block_code,shift\n";
      const body = rows.map(r => [r.organization_id, r.line_code, r.planned_vehicle_prefix, r.planned_departure, r.planned_arrival, r.block_code, r.shift].join(",")).join("\n");
      const csv = header + body + "\n";
      return new Response(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="trips_generated_db.csv"' } });
    }
  }catch(e:any){
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'error' }), { status: 400 });
  }
}
