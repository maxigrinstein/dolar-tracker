import RateCard from "./components/RateCard.jsx";
import { useMemo } from "react";
import RatesBarChart from "./components/RatesBarChart";
import RatesTimeSeries from "./components/RateTimeSeries.jsx";
import { useRates } from "./hooks/useRates";

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
  const { rows, updatedAt, err, series } = useRates();
  const order = ["oficial","blue","bolsa","contadoconliqui","mayorista","tarjeta","cripto"];

  const sortedRows = useMemo(() => {
    // orden por tipo conocido (oficial, blue, mep, ccl, …)
    const byOrder = (a, b) => order.indexOf(a.casa) - order.indexOf(b.casa);
    return [...rows].sort(byOrder);
  }, [rows]);

  const displayed = order.filter(k => rows.some(d => d.casa === k));

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <div className="fixed inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <main className="relative w-full">
        <div className="max-w-[2000px] mx-auto p-6 text-slate-100">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              USD/ARS
            </h1>
            <p className="text-slate-400">
              Última actualización: {updatedAt || "—"}
            </p>
          </header>

          {err && (
            <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-200 text-sm">{err}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
          
          <section className="space-y-8 mt-8">
            <div className="w-full">
              <RatesBarChart data={sortedRows} LABELS={LABELS} />
            </div>
            
            <div className="w-full">
              <RatesTimeSeries series={series} LABELS={LABELS} displayed={displayed} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;