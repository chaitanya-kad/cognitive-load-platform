import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSessions, clearSessions } from "../hooks/useApi";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleClear() {
    await clearSessions();
    setSessions([]);
  }

  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString();
  }

  function getCogColor(score) {
    if (score < 20) return "text-green-400";
    if (score < 50) return "text-amber-400";
    if (score < 75) return "text-orange-400";
    return "text-red-400";
  }

  function getCogLabel(score) {
    if (score < 20) return "Low";
    if (score < 50) return "Moderate";
    if (score < 75) return "High";
    return "Critical";
  }

  return (
    <div className="flex-1 bg-[#080c14] overflow-y-auto">
      {/* Topbar */}
      <div className="sticky top-0 z-10 bg-[#080c14] border-b border-[#1e2a3a] px-6 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-300">Session History</h2>
          <p className="text-xs text-[#334155]">{sessions.length} sessions recorded</p>
        </div>
        <button
          onClick={handleClear}
          disabled={sessions.length === 0}
          className="text-xs border border-red-900 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-950 transition-colors disabled:opacity-30"
        >
          Clear All
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center text-[#334155] font-mono text-sm mt-20">Loading...</div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-20"
          >
            <p className="text-[#334155] font-mono text-sm">No sessions yet</p>
            <p className="text-[#1e2a3a] font-mono text-xs mt-2">Go to Dashboard and save a session</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {[...sessions].reverse().map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#0d1220] border border-[#1e2a3a] rounded-xl p-4 hover:border-[#334155] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#334155]">#{s.id}</span>
                  <span className="text-xs font-mono text-[#334155]">{formatDate(s.timestamp)}</span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-[10px] text-[#334155] uppercase tracking-widest mb-1">WPM</p>
                    <p className="text-xl font-bold font-mono text-green-400">{s.wpm}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#334155] uppercase tracking-widest mb-1">Keystrokes</p>
                    <p className="text-xl font-bold font-mono text-blue-400">{s.keystrokes}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#334155] uppercase tracking-widest mb-1">Accuracy</p>
                    <p className="text-xl font-bold font-mono text-amber-400">{s.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#334155] uppercase tracking-widest mb-1">Backspaces</p>
                    <p className="text-xl font-bold font-mono text-red-400">{s.backspaces}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#334155] uppercase tracking-widest mb-1">Cog Load</p>
                    <p className={`text-xl font-bold font-mono ${getCogColor(s.cognitive_score)}`}>
                      {getCogLabel(s.cognitive_score)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}