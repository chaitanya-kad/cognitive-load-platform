export default function StatsCard({ label, value, unit, accent = false }) {
  return (
    <div className={`rounded-xl p-4 border border-[#1e2a3a] ${accent ? "bg-[#0d1220]" : "bg-[#080c14]"}`}>
      <p className="text-xs text-[#334155] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold font-mono text-green-400 leading-none">{value}</p>
      <p className="text-xs text-[#334155] mt-1">{unit}</p>
    </div>
  );
}