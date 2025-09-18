import { sendWebhook } from '@/lib/webhook';
import { logAudit } from '@/lib/audit';
import { requireRole } from '@/lib/authServer';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest, { params }: { params: { tripId: string } }) {
  try {
    const body = await req.json();
    await requireRole(req, body.organization_id, ['controle','supervisor','admin','fiscal']);
    const admin = supabaseAdmin();
    const { data: tripRow, error: tErr } = await admin.from('trips').select('id, planned_departure, organization_id').eq('id', params.tripId).single();
    if (tErr || !tripRow) return new Response(JSON.stringify({ ok:false, error:'Trip not found' }), { status: 404 });
    const payload = {
      organization_id: tripRow.organization_id,
      trip_id: tripRow.id,
      vehicle_id: body.vehicle_id || null,
      actual_departure: body.actual_departure ? new Date(body.actual_departure).toISOString() : new Date().toISOString(),
      reason_code: body.reason_code || null,
      note: body.note || null,
      planned_departure: tripRow.planned_departure
    };
    const { error } = await admin.from('trip_events').insert(payload);
    if (error) throw error;
    await logAudit({ organization_id: (typeof body!=='undefined' && body.organization_id) ? body.organization_id : (typeof tripRow!=='undefined' ? tripRow.organization_id : null), action:'trip_event.create', entity:'trip_events', entity_id: (typeof ins!=='undefined' ? ins.id : (typeof body!=='undefined' ? body.trip_id : null)), summary: {} });
    await sendWebhook('trip_event.created', typeof body!=='undefined'? body : (typeof payload!=='undefined'? payload : {}));
    return new Response(JSON.stringify({ ok:true }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message||'error' }), { status: 400 });
  }
}
