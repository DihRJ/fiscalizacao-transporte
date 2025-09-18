'use client';
import { useEffect, useRef, useState } from 'react';

export default function SignaturePad({ onChange }:{ onChange?: (blob:Blob)=>void }){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(()=>{
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
  },[]);

  function getPos(e: any) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  }

  function start(e:any){ setDrawing(true); const {x,y}=getPos(e); const ctx = canvasRef.current!.getContext('2d')!; ctx.beginPath(); ctx.moveTo(x,y); }
  function move(e:any){ if(!drawing) return; const {x,y}=getPos(e); const ctx = canvasRef.current!.getContext('2d')!; ctx.lineTo(x,y); ctx.stroke(); }
  function end(){ setDrawing(false); }

  async function handleExport(){
    const canvas = canvasRef.current!;
    canvas.toBlob((b)=>{ if (b && onChange) onChange(b); }, 'image/png', 0.9);
  }
  function clearCanvas(){
    const c = canvasRef.current!; const ctx = c.getContext('2d')!; ctx.clearRect(0,0,c.width,c.height);
  }

  return (<div className="card">
    <div className="label">Assinatura do motorista</div>
    <canvas
      ref={canvasRef} width={640} height={180}
      onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
      onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      style={{border:'1px solid #e5e7eb', borderRadius:8, background:'#fff', width:'100%', touchAction:'none'}}
    />
    <div style={{display:'flex', gap:8, marginTop:8}}>
      <button className="btn" type="button" onClick={clearCanvas}>Limpar</button>
      <button className="btn" type="button" onClick={handleExport}>Usar Assinatura</button>
    </div>
  </div>);
}
