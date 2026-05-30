import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function KeyFreqChart({ keyFreq }) {
  const data = Object.entries(keyFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => ({ key: key === " " ? "SPC" : key.toUpperCase(), count }));

  const max = data[0]?.count || 1;

  return (
    <div className="bg-[#0d1220] rounded-2xl border border-[#1e2a3a] p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Top Keys</p>
        <p className="text-sm text-gray-500 mt-0.5">Most frequently pressed</p>
      </div>
      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">
          Start typing to see data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="key" tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={`rgba(59,130,246,${0.3 + (entry.count / max) * 0.7})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}