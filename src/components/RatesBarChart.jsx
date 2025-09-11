import {
BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

function CustomTooltip({ active, payload, label }) {
if (active && payload && payload.length) {
    return (
    <div className="bg-slate-300/70 p-2 rounded shadow text-sm">
        {/* Label (ej: CCL) */}
        <p className="font-semibold text-black mb-1">{label}</p>

        {/* Valores */}
        {payload.map((entry) => (
        <p
            key={entry.dataKey}
            className={
            entry.dataKey === "compra"
                ? "text-emerald-600 font-medium"
                : entry.dataKey === "venta"
                ? "text-red-600 font-medium"
                : "text-gray-700"
            }
        >
            {entry.dataKey} : {entry.value}
        </p>
        ))}
    </div>
    );
}
return null;
}

export default function RatesBarChart({ data, LABELS }) {
const rows = (data || []).map(d => ({
    name: LABELS[d.casa] || d.nombre || d.casa,
    compra: Number(d.compra ?? 0),
    venta: Number(d.venta ?? 0),
}));


return (
    <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 shadow h-96">
    <h2 className="text-lg font-semibold mb-2">Comparativo por tipo</h2>
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#ccc" }} />
        <YAxis tick={{ fontSize: 12, fill: "#ccc" }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.15)" }} /> 
        <Legend
            formatter={(value) => (
            <span style={{ color: "#e2e8f0" }}>{value}</span>
            )}
        />
        <Bar dataKey="compra" fill="#1e7939be" /> {/* verde */}
        <Bar dataKey="venta" fill="#8d2525c2" />   {/* rojo */}
        </BarChart>
    </ResponsiveContainer>
    </div>
);
}
