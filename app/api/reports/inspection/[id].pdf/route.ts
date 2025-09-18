import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = supabaseAdmin();
  const id = params.id;
  const { data: insp, error } = await admin
    .from('inspections')
    .select('id, organization_id, result, notes, inspected_at, template_id, vehicle_id, line_id')
    .eq('id', id).single();
  if (error || !insp) return new Response('Not found', { status: 404 });

  // Fetch template name, vehicle prefix, attachments
  const [{ data: tpl }] = await Promise.all([
    admin.from('checklist_templates').select('name').eq('id', insp.template_id).single()
  ]);
  const veh = insp.vehicle_id ? await admin.from('vehicles').select('prefix, plate').eq('id', insp.vehicle_id).single() : { data:null };
  const at = await admin.from('attachments').select('path, mime, size_bytes').eq('owner_type','inspection').eq('owner_id', id);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];
  doc.on('data', (c:any) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  // Header
  doc.fontSize(16).text('Relatório de Vistoria — Fiscalização de Ônibus', { align: 'left' });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Vistoria: ${insp.id}`);
  doc.text(`Organização: ${insp.organization_id}`);
  doc.text(`Template: ${tpl?.name||insp.template_id}`);
  doc.text(`Veículo: ${veh?.data?.prefix || '-'}  Placa: ${veh?.data?.plate || '-'}`);
  doc.text(`Resultado: ${insp.result}`);
  doc.text(`Data/Hora: ${insp.inspected_at}`);
  if (insp.notes) { doc.moveDown(0.5); doc.text(`Observações: ${insp.notes}`); }

  // QR code with verification URL (could be a future public page)
  const verifyUrl = `${req.nextUrl.origin}/verify/inspection/${insp.id}`;
  const qrPng = await QRCode.toBuffer(verifyUrl, { type: 'png', margin: 1, width: 148 });
  doc.image(qrPng, { fit: [120,120], align: 'left' });
  doc.moveDown(1);

  // Attachments list
  doc.fontSize(12).text('Anexos', { underline: true });
  if (at.data && at.data.length) {
    doc.fontSize(10);
    at.data.forEach((x:any, idx:number) => {
      doc.text(`${idx+1}. ${x.path} (${x.mime || 'mime desconhecido'}) ${x.size_bytes ? `— ${x.size_bytes} bytes` : ''}`);
    });
  } else {
    doc.fontSize(10).text('Nenhum anexo.');
  }

  // Footer
  doc.moveDown(1);
  doc.fontSize(8).text(`Gerado em ${new Date().toISOString()} — ${verifyUrl}`);

  doc.end();
  const pdf = await done;
  return new Response(pdf, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="relatorio-inspecao-${insp.id}.pdf"` } });
}
