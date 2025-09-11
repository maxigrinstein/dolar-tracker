import RateCard from "./components/RateCard.jsx";
// import { rates } from "./data/rates";
import { useEffect, useMemo, useState } from "react";
import RatesBarChart from "./components/RatesBarChart";
import RatesTimeSeries from "./components/RateTimeSeries.jsx";

const LABELS = {
  oficial: "Oficial",
  blue: "Blue",
  bolsa: "MEP",               // mapeo de doc oficial → nombre común
  contadoconliqui: "CCL",
  mayorista: "Mayorista",
  tarjeta: "Tarjeta",
  cripto: "Cripto",
};

function App() {

  const [rows, setRows] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [err, setErr] = useState(null);

  // series: { tipo: [{ t: "HH:MM:SS", v: venta }] }
  const [series, setSeries] = useState({});

  async function load(){
    try{
      setErr(null);
      const res = await fetch("https://dolarapi.com/v1/dolares");
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // data es un array con { compra, venta, casa, nombre, moneda, fechaActualizacion }
      setRows(Array.isArray(data) ? data : []);
      // tomamos la fecha más reciente de actualización
      const last = data
        .map(d => d.fechaActualizacion)
        .filter(Boolean)
        .sort()
        .at(-1);
      setUpdatedAt(last ?? null);
      // actualizar series (usamos 'venta' para el gráfico de líneas)
      const t = new Date().toLocaleTimeString("es-AR", { hour12: false });
      setSeries(prev => {
        const next = { ...prev };
        (data || []).forEach(d => {
          const key = d.casa; // oficial, blue, bolsa, contadoconliqui, ...
          const v = Number(d.venta ?? 0);
          if (!next[key]) next[key] = [];
          // evitamos duplicar el mismo timestamp
          if (!next[key].length || next[key][next[key].length - 1].t !== t) {
            next[key] = [...next[key], { t, v }];
          }
        });
        return next;
      });
    }catch (e) {
      setErr(e.message || "Error cargando datos");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);
  const order = ["oficial","blue","bolsa","contadoconliqui","mayorista","tarjeta","cripto"];

  const sortedRows = useMemo(() => {
    // orden por tipo conocido (oficial, blue, mep, ccl, …)
    const byOrder = (a, b) => order.indexOf(a.casa) - order.indexOf(b.casa);
    return [...rows].sort(byOrder);
  }, [rows]);

  const displayed = order.filter(k => rows.some(d => d.casa === k));
  return (
    <div className="min-h-screen min-w-screen px-4 py-8 max-w-6xl mx-auto bg-slate-950 text-slate-100">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          USD/ARS (DolarApi)
        </h1>
        <p className="text-slate-400">
          Última actualización: {updatedAt ? new Date(updatedAt).toLocaleString("es-AR") : "—"}
        </p>
      </header>

      {err && (
        <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-200 text-sm">{err}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2">
        {sortedRows.map((d) => (
          <RateCard
            key={d.casa}
            label={LABELS[d.casa] || d.nombre || d.casa}
            buy={d.compra}
            sell={d.venta}
            source="dolarapi.com"
            updatedAt={d.fechaActualizacion}
          />
        ))}
      </div>
      {/* Gráfico de barras (foto del momento) */}
      <div className="my-6 bg-color-slate-150">
        <RatesBarChart data={sortedRows} LABELS={LABELS} />
      </div>

      
    </div>
    
  )
}

export default App
