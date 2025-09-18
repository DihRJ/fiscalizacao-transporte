'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function login(e:any){
    e.preventDefault();
    setMsg('Autenticando...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? 'Erro: '+error.message : 'OK! Você está logado.');
  }

  async function logout(){
    await supabase.auth.signOut();
    setMsg('Logout efetuado');
  }

  return (<div style={{maxWidth:420}}>
    <h2>Login</h2>
    <form onSubmit={login}>
      <label>Email <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
      <label>Senha <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
      <button className="btn" type="submit">Entrar</button>
    </form>
    <button className="btn" onClick={logout} style={{marginTop:8}}>Sair</button>
    <div>{msg}</div>
  </div>);
}
