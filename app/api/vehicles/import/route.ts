import { NextRequest } from 'next/server';
import { parse } from 'csv-parse/sync';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authServer';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest){
  try{
    const csv = await req.text();
    const rows = parse(csv, { columns: true, skip_empty_lines: true });
    if (!rows.length) return new Response(JSON.stringify({ ok:false, error:'empty csv' }), { status: 400 });
    const orgId = rows[0]?.organization_id;
    await requireRole(req, orgId, ['supervisor','admin']);
    const admin = supabaseAdmin();
    let upserts = 0;
    for (const r of rows){
      if (!r.organization_id || !r.prefix) continue;
      const insert = {
        organization_id: r.organization_id,
        prefix: String(r.prefix).trim(),
        plate: r.plate ? String(r.plate).trim() : null,
        qrcode: r.qrcode ? String(r.qrcode).trim() : null
      };
      const { error } = await admin.from('vehicles').upsert(insert, { onConflict: 'organization_id,prefix' });
      if (!error) upserts++;
    }
    await logAudit({ organization_id: orgId, user_id: null, action:'vehicles.import', entity:'vehicles', entity_id: null, summary: { count: upserts } });
    return new Response(JSON.stringify({ ok:true, upserts }), { status: 200, headers: { 'Content-Type':'application/json' } });
  }catch(e:any){
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'parse error' }), { status: 400 });
  }
}
