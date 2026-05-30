import { motion, AnimatePresence } from "framer-motion";

function generateInsights({ wpm, accuracy, burstCount, pauses, consistencyScore, focusDecay, elapsed }) {
  const insights = [];
  const mins = elapsed / 60000;

  if (burstCount >= 2)
    insights.push({ type: "warning", text: `${burstCount} error burst${burstCount > 1 ? "s" : ""} detected — possible cognitive overload` });

  if (consistencyScore < 60)
    insights.push({ type: "warning", text: `Typing consistency dropped to ${consistencyScore}% — erratic rhythm detected` });
  else if (consistencyScore > 85)
    insights.push({ type: "success", text: `High typing consistency at ${consistencyScore}% — focused state detected` });

  if (pauses >= 3)
    insights.push({ type: "info", text: `${pauses} significant pauses detected — possible processing delays` });

  if (focusDecay > 60)
    insights.push({ type: "warning", text: `Focus decay at ${focusDecay}% — cognitive fatigue likely after ${Math.round(mins)}min` });

  if (wpm > 60 && accuracy > 90)
    insights.push({ type: "success", text: `High performance: ${wpm} WPM at ${accuracy}% accuracy` });

  if (wpm > 0 && wpm < 20)
    insights.push({ type: "info", text: `Low WPM (${wpm}) — slow deliberate typing or high mental load` });

  if (accuracy < 70 && accuracy > 0)
    insights.push({ type: "danger", text: `Accuracy at ${accuracy}% — high error density, stress likely` });

  if (insights.length === 0 && wpm > 0)
    insights.push({ type: "success", text: "Normal typing pattern — no anomalies detected" });

  if (insights.length === 0)
    insights.push({ type: "info", text: "Start typing to generate behavioral insights..." });

  return insights;
}

const icons = { success: "✓", warning: "⚠", danger: "✕", info: "→" };
const colors = {
  success: "border-green-900 text-green-400 bg-green-950/30",
  warning: "border-amber-900 text-amber-400 bg-amber-950/30",
  danger:  "border-red-900 text-red-400 bg-red-950/30",
  info:    "border-[#1e2a3a] text-slate-400 bg-[#0d1220]",
};

export default function InsightsPanel({ wpm, accuracy, burstCount, pauses, consistencyScore, focusDecay, elapsed }) {
  const insights = generateInsights({ wpm, accuracy, burstCount, pauses, consistencyScore, focusDecay, elapsed });

  return (
    <div className="bg-[#0d1220] rounded-2xl border border-[#1e2a3a] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-[#334155] uppercase tracking-widest">Behavioral Insights</p>
        <span className="text-[10px] font-mono text-[#334155] border border-[#1e2a3a] px-2 py-0.5 rounded">
          AI ANALYSIS
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {insights.map((insight, i) => (
            <motion.div
              key={insight.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-3 p-3 rounded-lg border text-xs ${colors[insight.type]}`}
            >
              <span className="font-mono font-bold flex-shrink-0 mt-0.5">{icons[insight.type]}</span>
              <span>{insight.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}