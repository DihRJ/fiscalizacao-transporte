import { supabaseAdmin } from '@/lib/supabaseAdmin';
import * as XLSX from 'xlsx';

export const runtime = 'nodejs';

export async function GET() {
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('kpi_otp_by_line_day').select('organization_id,line_id,day,otp_percent').order('day', { ascending: false }).limit(500);
  if (error) return new Response('error', { status: 500 });
  const rows = (data||[]).map((r:any)=>({ ...r, day: r.day?.slice(0,10) }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'OTP');
  const buf = XLSX.write(wb, { type:'buffer', bookType:'xlsx' }) as Buffer;
  return new Response(buf, { status: 200, headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="kpi-otp.xlsx"' } });
}
