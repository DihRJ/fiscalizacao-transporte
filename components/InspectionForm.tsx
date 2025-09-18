'use client';
import { useRef, useState } from 'react';
import SignaturePad from '@/components/SignaturePad';
import QRScanner from '@/components/QRScanner';

export default function InspectionForm(){
  const [form, setForm] = useState({ organization_id:'', template_id:'', vehicle_id:'', result:'aprovado', notes:'' });
  const [answers, setAnswers] = useState<{item_id:string, value_json:any, required?:boolean}[]>([]);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement|null>(null);
  const [inspectionId, setInspectionId] = useState<string| null>(null);
  const [signatureBlob, setSignatureBlob] = useState<Blob| null>(null);

  function handleQR(text:string){
    // Put the scanned text in the vehicle_id field; adapt if your QR encodes a prefix you must resolve server-side
    setForm(prev => ({...prev, vehicle_id: text}));
  }

  async function submit(e:any){
    e.preventDefault();
    setMsg('Salvando...');
    const res = await fetch('/api/inspections', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, answers }) });
    const j = await res.json();
    if (!j.ok) { setMsg('Erro: '+j.error); return; }
    setInspectionId(j.id);
    setMsg('Vistoria criada. Enviando anexos (se houver)...');

    async function upload(name: string, blob: Blob){
      const fd = new FormData();
      fd.set('organization_id', form.organization_id);
      fd.set('owner_type', 'inspection');
      fd.set('owner_id', j.id);
      fd.set('file', new File([blob], name));
      await fetch('/api/uploads', { method:'POST', body: fd });
    }

    const files = fileRef.current?.files;
    if (files && files.length) {
      for (const f of Array.from(files)) await upload(f.name, f);
    }
    if (signatureBlob) await upload('assinatura.png', signatureBlob);

    setMsg('Vistoria criada e anexos enviados.');
  }

  return (<form onSubmit={submit}>
    <h3>Nova Vistoria</h3>
    <label>Org <input value={form.organization_id} onChange={e=>setForm({...form, organization_id:e.target.value})} required /></label>
    <label>Template <input value={form.template_id} onChange={e=>setForm({...form, template_id:e.target.value})} required /></label>
    <label>Veículo <input value={form.vehicle_id} onChange={e=>setForm({...form, vehicle_id:e.target.value})} required /></label>
    <QRScanner onResult={handleQR} />
    <label>Resultado
      <select value={form.result} onChange={e=>setForm({...form, result:e.target.value})}>
        <option value="aprovado">Aprovado</option>
        <option value="reprovado">Reprovado</option>
        <option value="pendente">Pendente</option>
      </select>
    </label>
    <label>Observações <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} /></label>
    <SignaturePad onChange={setSignatureBlob} />
    <label>Evidências (fotos/vídeos curtos/PDFs) <input ref={fileRef} type="file" multiple /></label>
    <button className="btn" type="submit">Salvar</button>
    <div>{msg}</div>
    {inspectionId && <p>Gerar PDF: <a href={`/api/reports/inspection/${inspectionId}.pdf`} target="_blank">baixar relatório</a></p>}
  </form>);
}
