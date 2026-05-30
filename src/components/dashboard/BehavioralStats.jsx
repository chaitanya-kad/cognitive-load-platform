import { motion } from "framer-motion";

function StatBar({ label, value, max = 100, color = "#4ade80" }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] font-mono text-[#334155] uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="w-full h-1.5 bg-[#1e2a3a] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export default function BehavioralStats({ consistencyScore, focusDecay, burstCount, pauses, keystrokes, elapsed }) {
  const focusScore = Math.max(0, 100 - focusDecay);
  const stressLikelihood = Math.min(100, Math.round(burstCount * 15 + (100 - consistencyScore) * 0.5));
  const fatigue = Math.min(100, Math.round((elapsed / 300000) * 40 + focusDecay * 0.6));
  const avgPauseRate = elapsed > 0 ? Math.round((pauses / (elapsed / 60000)) * 10) / 10 : 0;

  return (
    <div className="bg-[#0d1220] rounded-2xl border border-[#1e2a3a] p-5">
      <p className="text-xs font-semibold text-[#334155] uppercase tracking-widest mb-5">
        Behavioral Analysis
      </p>
      <StatBar label="Focus Score" value={focusScore} color="#4ade80" />
      <StatBar label="Typing Consistency" value={consistencyScore} color="#60a5fa" />
      <StatBar label="Stress Likelihood" value={stressLikelihood} color="#f87171" />
      <StatBar label="Cognitive Fatigue" value={fatigue} color="#fbbf24" />

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1e2a3a]">
        <div>
          <p className="text-[10px] text-[#334155] font-mono uppercase tracking-widest mb-1">Error Bursts</p>
          <p className="text-lg font-bold font-mono text-red-400">{burstCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#334155] font-mono uppercase tracking-widest mb-1">Pauses/min</p>
          <p className="text-lg font-bold font-mono text-amber-400">{avgPauseRate}</p>
        </div>
      </div>
    </div>
  );
}