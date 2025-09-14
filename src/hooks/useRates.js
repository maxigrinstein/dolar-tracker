import { useState, useEffect } from 'react';

export function useRates() {
        const [rows, setRows] = useState([]);
        const [updatedAt, setUpdatedAt] = useState(null);
        const [err, setErr] = useState(null);
        const [series, setSeries] = useState({});

const load = async () => {
    try {
        const res = await fetch("https://dolarapi.com/v1/dolares");
        if (!res.ok) throw new Error("Error al cargar datos");
        const data = await res.json();

        const now = new Date().toLocaleString("es-AR");
        setRows(data);
        setUpdatedAt(now);
        setErr(null);

        // Actualizar series temporales
        setSeries(prev => {
            const next = { ...prev };
            data.forEach(d => {
            const points = next[d.casa] || [];
            points.push({
                t: now,
                v: d.venta,
            });
            // Mantener solo últimas 50 mediciones
            next[d.casa] = points.slice(-50);
            });
            return next;
        });

    } catch (e) {
        console.error(e);
        setErr(e.message);
        }
    }

    useEffect(() => {
        load();
        const id = setInterval(load, 15000);
        return () => clearInterval(id);
    }, []);

    return {
        rows,
        updatedAt,
        err,
        series,
        refreshData: load
    };
}