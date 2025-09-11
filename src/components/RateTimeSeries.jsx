import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

// series: { oficial: [{t, v}], blue: [{t, v}], ... }
// displayed: ["oficial","blue","bolsa","contadoconliqui"]
export default function RatesTimeSeries({ series, LABELS, displayed }) {
  // Convertimos series por tipo a formato recharts: una fila por timestamp
  //  { t: "10:35:00", oficial: 950, blue: 1290, mep: 1188, ... }
    const timestamps = new Set();
    displayed.forEach(k => (series[k] || []).forEach(p => timestamps.add(p.t)));
    const sortedTimes = Array.from(timestamps).sort();

    const rows = sortedTimes.map(t => {
        const row = { t };
        displayed.forEach(k => {
            const point = (series[k] || []).find(p => p.t === t);
            row[k] = point ? point.v : null;
        });
        return row;
    });

    const palette = ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#22d3ee", "#c084fc", "#f87171"];

    return (
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 shadow h-96">
            <h2 className="text-lg font-semibold mb-2">Evolución (venta) — sesión actual</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                {displayed.map((k, i) => (
                    <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={LABELS[k] || k}
                    dot={false}
                    stroke={palette[i % palette.length]}
                    strokeWidth={2}
                    connectNulls
                    />
                ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
