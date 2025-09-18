import { sendWebhook } from '@/lib/webhook';
import { logAudit } from '@/lib/audit';
import { requireRole } from '@/lib/authServer';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await requireRole(req, body.organization_id, ['fiscal','supervisor','admin']);
    const admin = supabaseAdmin();
    const inspection = {
      organization_id: body.organization_id,
      template_id: body.template_id,
      vehicle_id: body.vehicle_id || null,
      line_id: body.line_id || null,
      stop_id: body.stop_id || null,
      inspector_id: body.inspector_id || null,
      result: body.result || 'aprovado',
      notes: body.notes || null,
      closed: true
    };
    const { data: ins, error: insErr } = await admin.from('inspections').insert(inspection).select('id, organization_id').single();
    if (insErr) throw insErr;
    const answers = (body.answers||[]).map((a:any)=>({ inspection_id: ins.id, item_id: a.item_id, value_json: a.value_json, required: !!a.required }));
    if (answers.length) {
      const { error: ansErr } = await admin.from('inspection_answers').insert(answers);
      if (ansErr) throw ansErr;
    }
    await logAudit({ organization_id: (typeof body!=='undefined' && body.organization_id) ? body.organization_id : (typeof tripRow!=='undefined' ? tripRow.organization_id : null), action:'inspection.create', entity:'inspections', entity_id: (typeof ins!=='undefined' ? ins.id : (typeof body!=='undefined' ? body.owner_id : null)), summary: {} });
    await sendWebhook('inspection.created', typeof body!=='undefined'? body : (typeof payload!=='undefined'? payload : {}));
    return new Response(JSON.stringify({ ok:true, id: ins.id }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message||'error' }), { status: 400 });
  }
}
