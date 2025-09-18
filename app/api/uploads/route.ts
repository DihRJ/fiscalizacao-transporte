import { logAudit } from '@/lib/audit';
import { requireRole } from '@/lib/authServer';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const admin = supabaseAdmin();
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ ok:false, error:'content-type must be multipart/form-data' }), { status: 400 });
    }
    const formData = await req.formData();
    const organization_id = formData.get('organization_id') as string;
    const owner_type = formData.get('owner_type') as string; // inspection | incident | trip_event | report
    const owner_id = formData.get('owner_id') as string;
    const file = formData.get('file') as File;
    if (!organization_id || !owner_type || !owner_id || !file) {
      return new Response(JSON.stringify({ ok:false, error:'missing fields' }), { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const path = `${organization_id}/${owner_type}/${owner_id}/${file.name}`;
    const { error: upErr } = await admin.storage.from('attachments').upload(path, bytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: true
    });
    if (upErr) throw upErr;
    // Register logical attachment row (optional convenience)
    await admin.from('attachments').insert({
      organization_id, owner_type, owner_id, path, mime: file.type || null, size_bytes: file.size || null
    });
    await logAudit({ organization_id: (typeof body!=='undefined' && body.organization_id) ? body.organization_id : (typeof tripRow!=='undefined' ? tripRow.organization_id : null), action:'attachment.upload', entity:'attachments', entity_id: (typeof ins!=='undefined' ? ins.id : (typeof body!=='undefined' ? body.owner_id : null)), summary: {} });
    return new Response(JSON.stringify({ ok:true, path }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ ok:false, error:e?.message||'upload error' }), { status: 400 });
  }
}
