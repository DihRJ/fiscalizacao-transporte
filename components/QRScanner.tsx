'use client';
import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export default function QRScanner({ onResult }:{ onResult: (text:string)=>void }){
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [active, setActive] = useState(false);

  useEffect(()=>{
    let stream: MediaStream;
    async function start(){
      try{
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current){ videoRef.current.srcObject = stream; await videoRef.current.play(); setActive(true); tick(); }
      }catch(e){ console.error(e); }
    }
    start();
    return ()=>{ stream && stream.getTracks().forEach(t=>t.stop()); setActive(false); };
  },[]);

  async function tick(){
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext('2d')!;
    c.width = v.videoWidth; c.height = v.videoHeight;
    const loop = () => {
      if (!active) return;
      ctx.drawImage(v, 0,0, c.width, c.height);
      const img = ctx.getImageData(0,0, c.width, c.height);
      const code = jsQR(img.data, img.width, img.height);
      if (code?.data) { onResult(code.data); setActive(false); try{ (v.srcObject as MediaStream)?.getTracks().forEach(t=>t.stop()); }catch{} }
      else requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  return (<div className="card">
    <div className="label">Scanner de QRCode</div>
    <video ref={videoRef} playsInline muted style={{width:'100%', borderRadius:8, background:'#000'}}></video>
    <canvas ref={canvasRef} style={{display:'none'}} />
    <div style={{fontSize:12, color:'#6b7280', marginTop:8}}>Aponte a câmera para o QR do veículo (prefixo ou ID).</div>
  </div>);
}
