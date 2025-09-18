import './globals.css';
import { ReactNode, useEffect } from 'react';

export const metadata = { title: 'Fiscalização de Ônibus', description: 'App de fiscalização operacional' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b1220" />
      </head>
      <body>
        import OrgSelector from '@/components/OrgSelector';

export const metadata = { title: 'Fiscalização de Ônibus', description: 'App de fiscalização operacional' };

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b1220" />
      </head>
      <body>
        <header style={{padding:'12px 16px', borderBottom:'1px solid #eee'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div><strong>Fiscalização de Ônibus</strong> — Dashboard</div>
            <OrgSelector />
          </div> style={{padding:'12px 16px', borderBottom:'1px solid #eee'}}>
          <strong>Fiscalização de Ônibus</strong> — Dashboard
          <div style={{float:'right'}}><a href="/auth">Login</a></div><nav style={{marginTop:8, display:'flex', gap:12}}>
            <a href="/">Início</a>
            <a href="/dashboard">Painel</a>
            <a href="/trips">Viagens</a>
            <a href="/inspections/new">Nova Vistoria</a>
            <a href="/incidents/new">Novo Incidente</a>
            <a href="/reports">Relatórios</a>
            <a href="/admin">Admin</a>
          </nav>
        </header>
        <main style={{padding:16}}>{children}</main>
        <script dangerouslySetInnerHTML={{__html:`
          if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(()=>{});
          }
        `}} />
      </body>
    </html>
  );
}
