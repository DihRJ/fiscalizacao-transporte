import { supabaseAdmin } from '@/lib/supabaseAdmin';
import * as XLSX from 'xlsx';

export async function GET(){
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('trip_events').select('organization_id,trip_id,vehicle_id,actual_departure,reason_code,note,planned_departure,delay_min').order('planned_departure', { ascending: false }).limit(5000);
  if (error) return new Response('error', { status: 500 });
  const rows = (data||[]).map((r:any)=>({ ...r, planned_day: r.planned_departure?.slice(0,10) }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Atrasos');
  const buf = XLSX.write(wb, { type:'buffer', bookType:'xlsx' }) as Buffer;
  return new Response(buf, { status: 200, headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="atrasos.xlsx"' } });
}
