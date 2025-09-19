'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type Role = 'admin' | 'supervisor' | 'fiscal' | 'auditor' | 'controle';

export function useRole(organization_id?: string){
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const org = organization_id || localStorage.getItem('organization_id') || '';
      if (!org){ setRole(null); setLoading(false); return; }
      const { data: mem } = await supabase.from('memberships').select('role').eq('organization_id', org).limit(1);
      setRole(mem && mem[0]?.role || null);
      setLoading(false);
    })();
  }, [organization_id]);
  return { role, loading };
}

export function RoleGate({ allow, children }:{ allow: Role[]; children: React.ReactNode }){
  const { role, loading } = useRole();
  if (loading) return <div className="card">Carregando permissões...</div>;
  if (!role || !allow.includes(role)) return <div className="card">Acesso negado.</div>;
  return children;
}
