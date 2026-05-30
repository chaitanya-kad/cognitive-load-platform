import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";

export default function WPMChart({ data }) {
  return (
    <div className="bg-[#0d1220] rounded-2xl border border-[#1e2a3a] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">WPM Over Time</p>
          <p className="text-sm text-gray-500 mt-0.5">Words per minute trend</p>
        </div>
        <span className="text-xs font-mono bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg text-gray-500">
          LIVE
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            labelStyle={{ color: "#6b7280" }}
          />
          <Area type="monotone" dataKey="wpm" stroke="#22c55e" strokeWidth={2}
            fill="url(#wpmGrad)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}