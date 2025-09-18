import { supabaseAdmin } from '@/lib/supabaseAdmin';
import PDFDocument from 'pdfkit';

export const runtime = 'nodejs';

export async function GET(){
  const admin = supabaseAdmin();
  // Last 30 days aggregation (simple overview)
  const { data: kpi } = await admin.from('kpi_otp_by_line_day').select('line_id, day, otp_percent').gte('day', new Date(Date.now()-30*864e5).toISOString());
  const { data: incidents } = await admin.from('incidents').select('type, severity').gte('occurred_at', new Date(Date.now()-30*864e5).toISOString());
  const { data: vists } = await admin.from('inspections').select('result').gte('inspected_at', new Date(Date.now()-30*864e5).toISOString());

  const otpAvg = (kpi||[]).reduce((a,b)=>a+(b.otp_percent||0),0)/Math.max(1,(kpi||[]).length);
  const incidentCount = (incidents||[]).length;
  const grave = (incidents||[]).filter(i=>i.severity>=4).length;
  const aprov = (vists||[]).filter(v=>v.result==='aprovado').length;
  const reprov = (vists||[]).filter(v=>v.result==='reprovado').length;

  const doc = new PDFDocument({ size:'A4', margin:50 });
  const chunks: Buffer[] = [];
  doc.on('data', (c:any)=>chunks.push(c));
  const done = new Promise<Buffer>(res=>doc.on('end', ()=>res(Buffer.concat(chunks))));

  doc.fontSize(16).text('Relatório Mensal — Fiscalização de Ônibus', { align:'left' });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Período: últimos 30 dias`);
  doc.moveDown();
  doc.fontSize(12).text('KPIs Principais', { underline:true });
  doc.fontSize(11).text(`• OTP médio: ${isFinite(otpAvg) ? otpAvg.toFixed(1) : '--'}%`);
  doc.text(`• Incidentes: ${incidentCount} (graves: ${grave})`);
  doc.text(`• Vistorias: Aprovadas ${aprov} / Reprovadas ${reprov}`);

  doc.moveDown();
  doc.fontSize(12).text('Notas', { underline:true });
  doc.fontSize(10).text('Este é um sumário automático. Para gráficos e filtros por organização/linha, expanda este endpoint.');

  doc.end();
  const pdf = await done;
  return new Response(pdf, { status:200, headers:{ 'Content-Type':'application/pdf', 'Content-Disposition':'inline; filename="relatorio-mensal.pdf"' } });
}
