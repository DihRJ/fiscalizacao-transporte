import { requireRole } from '@/lib/authServer';
import { NextRequest } from 'next/server';
import { parse } from 'csv-parse/sync';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const csv = await req.text();
    // RBAC

    const rows = parse(csv, { columns: true, skip_empty_lines: true });
    if (!rows.length) return new Response(JSON.stringify({ ok:false, error:'empty csv' }), { status: 400 });
    await requireRole(req, rows[0]?.organization_id, ['supervisor','admin']);
    const admin = supabaseAdmin();
    let ok = 0;
    for (const r of rows) {
      // resolve line_id by code + organization_id
      const { data: lines, error: e1 } = await admin
        .from('lines').select('id')
        .eq('organization_id', r.organization_id).eq('code', r.line_code).limit(1);
      if (e1 || !lines?.length) continue;
      const line_id = lines[0].id;

      // resolve vehicle
      let planned_vehicle_id: string| null = null;
      if (r.planned_vehicle_prefix) {
        const { data: veh } = await admin
          .from('vehicles').select('id').eq('organization_id', r.organization_id).eq('prefix', r.planned_vehicle_prefix).limit(1);
        planned_vehicle_id = veh && veh[0]?.id || null;
      }

      const insert = {
        organization_id: r.organization_id,
        line_id,
        planned_vehicle_id,
        planned_departure: new Date(r.planned_departure).toISOString(),
        planned_arrival: r.planned_arrival ? new Date(r.planned_arrival).toISOString() : null,
        block_code: r.block_code || null,
        shift: r.shift || null
      };
      const { error: insErr } = await admin.from('trips').insert(insert);
      if (!insErr) ok++;
    }
    return new Response(JSON.stringify({ ok: true, inserted: ok }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message||'parse error' }), { status: 400 });
  }
}
