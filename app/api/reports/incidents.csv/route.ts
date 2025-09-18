import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(){
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('incidents').select('organization_id,type,severity,occurred_at,line_id,vehicle_id,description,status').limit(2000);
  if (error) return new Response('error', { status: 500 });
  const header = Object.keys(data?.[0]||{organization_id:'',type:'',severity:'',occurred_at:'',line_id:'',vehicle_id:'',description:'',status:''}).join(',');
  const rows = (data||[]).map((r:any)=>[r.organization_id,r.type,r.severity,r.occurred_at,r.line_id,r.vehicle_id,(r.description||'').replace(/\n/g,' ').replace(/,/g,';'),r.status].join(','));
  const csv = [header, ...rows].join('\n');
  return new Response(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="incidentes.csv"' } });
}
