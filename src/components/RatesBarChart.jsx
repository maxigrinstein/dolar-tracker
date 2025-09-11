import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COMPRA = "compra";
const VENTA = "venta";

export default function RatesBarChart({ data, LABELS }) {
    // Normalizamos a { name: "Blue", compra: 1250, venta: 1290 }
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
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="compra" fill="#1e79398a"/>
                <Bar dataKey="venta" fill="#8d25258a" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}