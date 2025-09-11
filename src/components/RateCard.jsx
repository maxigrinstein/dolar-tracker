export default function RateCard({ label, buy, sell, source}){
    return(
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 shadow hover:bg-slate-800 transition-all">
            <div className="text-sm uppercase tracking-wider text-slate-400 ">{label}</div>
                <div className="mt-2 flex items-end gap-6">
                    <div>
                        <div className="text-xs text-slate-400">Compra</div>
                        <div className="text-2xl font-semibold">${buy.toLocaleString("es-AR")}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400">Venta</div>
                        <div className="text-2xl font-semibold">${sell.toLocaleString("es-AR")}</div>
                    </div>
                </div>
            <div className="mt-3 text-xs text-slate-500">Fuente: {source}</div>
        </div>
    );
}