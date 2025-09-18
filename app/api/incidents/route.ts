import { sendWebhook } from '@/lib/webhook';
import { logAudit } from '@/lib/audit';
import { requireRole } from '@/lib/authServer';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await requireRole(req, body.organization_id, ['fiscal','supervisor','admin','controle']);
    const admin = supabaseAdmin();
    const row = {
      organization_id: body.organization_id,
      type: body.type,
      severity: body.severity,
      occurred_at: body.occurred_at ? new Date(body.occurred_at).toISOString() : new Date().toISOString(),
      line_id: body.line_id || null,
      vehicle_id: body.vehicle_id || null,
      trip_id: body.trip_id || null,
      description: body.description || null,
      status: 'aberto'
    };
    const { error } = await admin.from('incidents').insert(row);
    if (error) throw error;
    await logAudit({ organization_id: (typeof body!=='undefined' && body.organization_id) ? body.organization_id : (typeof tripRow!=='undefined' ? tripRow.organization_id : null), action:'incident.create', entity:'incidents', entity_id: (typeof ins!=='undefined' ? ins.id : (typeof body!=='undefined' ? body.owner_id : null)), summary: {} });
    await sendWebhook('incident.created', typeof body!=='undefined'? body : (typeof payload!=='undefined'? payload : {}));
    return new Response(JSON.stringify({ ok:true }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message||'error' }), { status: 400 });
  }
}
