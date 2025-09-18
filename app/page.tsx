export default function Home() {
  return (
    <section className="grid">
      <div className="card"><div className="label">OTP (Hoje)</div><div className="kpi">-- %</div></div>
      <div className="card"><div className="label">Atraso Médio</div><div className="kpi">-- min</div></div>
      <div className="card"><div className="label">% Canceladas</div><div className="kpi">-- %</div></div>
      <div className="card"><div className="label">Vistorias</div><div className="kpi">--</div></div>
      <div className="card"><div className="label">Incidentes</div><div className="kpi">--</div></div>
    </section>
  );
}
