import { NextRequest } from 'next/server';
import { parse } from 'csv-parse/sync';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authServer';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const csv = await req.text();
    const rows = parse(csv, { columns: true, skip_empty_lines: true });
    if (!rows.length) return new Response(JSON.stringify({ ok:false, error:'empty csv' }), { status: 400 });
    const orgId = rows[0]?.organization_id;
    await requireRole(req, orgId, ['supervisor','admin']);
    const admin = supabaseAdmin();
    let upserts = 0;
    for (const r of rows) {
      if (!r.organization_id || !r.code || !r.name) continue;
      const insert = {
        organization_id: r.organization_id,
        code: String(r.code).trim(),
        name: String(r.name).trim(),
        active: (String(r.active||'true').toLowerCase() !== 'false')
      };
      const { error } = await admin.from('lines').upsert(insert, { onConflict: 'organization_id,code' });
      if (!error) upserts++;
    }
    await logAudit({ organization_id: orgId, user_id: null, action:'lines.import', entity:'lines', entity_id: null, summary: { count: upserts } });
    return new Response(JSON.stringify({ ok:true, upserts }), { status: 200, headers: { 'Content-Type':'application/json' } });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message||'parse error' }), { status: 400 });
  }
}
