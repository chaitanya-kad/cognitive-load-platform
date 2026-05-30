import { motion } from "framer-motion";

export default function AnalyticsCard({ title, value, subtitle, trend, accent = "green" }) {
  const valueColors = {
    green: "text-green-400", blue: "text-blue-400",
    amber: "text-amber-400", red: "text-red-400",
  };
  const glowColors = {
    green: "hover:border-green-900 hover:shadow-green-950",
    blue:  "hover:border-blue-900 hover:shadow-blue-950",
    amber: "hover:border-amber-900 hover:shadow-amber-950",
    red:   "hover:border-red-900 hover:shadow-red-950",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-[#0d1220] border border-[#1e2a3a] rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${glowColors[accent]}`}
    >
      <p className="text-[10px] font-mono text-[#334155] uppercase tracking-widest mb-2">{title}</p>
      <motion.p
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`text-3xl font-bold font-mono ${valueColors[accent]}`}
      >
        {value}
      </motion.p>
      <p className="text-[11px] text-[#334155] mt-1">{subtitle}</p>
      {trend !== undefined && (
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full mt-2 inline-block
          ${trend >= 0 ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>
          {trend >= 0 ? "+" : ""}{trend}%
        </span>
      )}
    </motion.div>
  );
}