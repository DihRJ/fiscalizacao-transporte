import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest){
  try{
    const { organization_id, code } = await req.json();
    if (!organization_id || !code) return new Response(JSON.stringify({ ok:false, error:'missing fields' }), { status: 400 });
    const admin = supabaseAdmin();
    // Try by prefix, then by plate, then by qrcode field
    const { data: byPrefix } = await admin.from('vehicles').select('id').eq('organization_id', organization_id).eq('prefix', code).limit(1);
    if (byPrefix && byPrefix[0]) return new Response(JSON.stringify({ ok:true, vehicle_id: byPrefix[0].id }), { status: 200 });
    const { data: byPlate } = await admin.from('vehicles').select('id').eq('organization_id', organization_id).eq('plate', code).limit(1);
    if (byPlate && byPlate[0]) return new Response(JSON.stringify({ ok:true, vehicle_id: byPlate[0].id }), { status: 200 });
    const { data: byQR } = await admin.from('vehicles').select('id').eq('organization_id', organization_id).eq('qrcode', code).limit(1);
    if (byQR && byQR[0]) return new Response(JSON.stringify({ ok:true, vehicle_id: byQR[0].id }), { status: 200 });
    return new Response(JSON.stringify({ ok:false, error:'vehicle not found' }), { status: 404 });
  }catch(e:any){
    return new Response(JSON.stringify({ ok:false, error: e?.message||'error' }), { status: 400 });
  }
}
