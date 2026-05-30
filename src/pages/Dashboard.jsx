import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import WPMChart from "../components/dashboard/WPMChart";
import KeyFreqChart from "../components/dashboard/KeyFreqChart";
import CognitiveLoadMeter from "../components/dashboard/CognitiveLoadMeter";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import BehavioralStats from "../components/dashboard/BehavioralStats";
import KeystrokeHeatmap from "../components/KeystrokeHeatmap";
import { useTypingMetrics } from "../hooks/useTypingMetrics";
import { saveSession, getAnalyticsSummary } from "../hooks/useApi";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [wpmHistory, setWpmHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [saved, setSaved] = useState(false);
  const {
    keystrokes, backspaces, keyFreq, elapsed,
    pauses, burstCount, consistencyScore, focusDecay,
    recordKey, reset
  } = useTypingMetrics();
  const tickRef = useRef(null);

  useEffect(() => {
    getAnalyticsSummary().then(setSummary).catch(() => {});
  }, []);

  // Fixed WPM chart useEffect
  useEffect(() => {
    if (keystrokes === 0) return;
    const interval = setInterval(() => {
      const mins = (Date.now() - performance.now()) < 0 ? 0 : elapsed / 60000;
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const wpm = elapsed > 500 ? Math.round(words / (elapsed / 60000)) : 0;
      const time = new Date().toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      if (wpm >= 0) {
        setWpmHistory(prev => [...prev.slice(-20), { time, wpm }]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [keystrokes]); // only depends on keystrokes starting

  function calcWPM() {
    if (!elapsed || elapsed < 500) return 0;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return 0;
    return Math.round(words / (elapsed / 60000));
  }

  function calcAccuracy() {
    if (keystrokes === 0) return "—";
    return Math.max(0, Math.round(((keystrokes - backspaces) / keystrokes) * 100));
  }

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  async function handleSaveSession() {
    const acc = calcAccuracy();
    await saveSession({
      wpm: calcWPM(),
      keystrokes,
      backspaces,
      accuracy: typeof acc === "number" ? acc : 0,
      elapsed_ms: elapsed,
      cognitive_score: Math.round(Math.min(100, (backspaces / Math.max(keystrokes, 1)) * 80)),
      top_keys: keyFreq,
    });
    setSaved(true);
    getAnalyticsSummary().then(setSummary);
    setTimeout(() => setSaved(false), 2000);
  }

  const acc = calcAccuracy();
  const bsRate = keystrokes > 0 ? backspaces / keystrokes : 0;
  const wpm = calcWPM();

  return (
    <div className="flex-1 bg-[#080c14] overflow-y-auto">
      {/* Topbar */}
      <div className="sticky top-0 z-10 bg-[#080c14] border-b border-[#1e2a3a] px-6 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-300">Cognitive Load Dashboard</h2>
          <p className="text-xs text-[#334155]">Real-time behavioral analytics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveSession} disabled={keystrokes === 0}
            className="text-xs border border-green-900 px-3 py-1.5 rounded-lg text-green-400 hover:bg-green-950 transition-colors disabled:opacity-30">
            {saved ? "Saved ✓" : "Save Session"}
          </button>
          <button onClick={() => { reset(); setText(""); setWpmHistory([]); }}
            className="text-xs border border-[#1e2a3a] px-3 py-1.5 rounded-lg hover:bg-[#0d1220] text-[#334155] transition-colors">
            Reset Session
          </button>
        </div>
      </div>

      {/* Summary bar */}
      {summary && summary.total_sessions > 0 && (
        <div className="px-6 py-2 border-b border-[#1e2a3a] flex gap-6">
          <span className="text-xs font-mono text-[#334155]">Sessions: <span className="text-green-400">{summary.total_sessions}</span></span>
          <span className="text-xs font-mono text-[#334155]">Avg WPM: <span className="text-green-400">{summary.avg_wpm}</span></span>
          <span className="text-xs font-mono text-[#334155]">Avg Accuracy: <span className="text-green-400">{summary.avg_accuracy}%</span></span>
          <span className="text-xs font-mono text-[#334155]">Avg Cog Score: <span className="text-green-400">{summary.avg_cognitive_score}</span></span>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Analytics cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard title="WPM" value={wpm} subtitle="words per minute" trend={wpm > 40 ? 12 : -5} accent="green" />
          <AnalyticsCard title="Keystrokes" value={keystrokes} subtitle="total this session" accent="blue" />
          <AnalyticsCard title="Accuracy" value={acc === "—" ? "—" : acc + "%"} subtitle="correction rate" accent="amber" />
          <AnalyticsCard title="Session" value={formatTime(elapsed)} subtitle="time elapsed" accent="red" />
        </div>

        {/* Cognitive load + heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CognitiveLoadMeter wpm={wpm} accuracy={acc} backspaceRate={bsRate} />
          <div className="lg:col-span-2 bg-[#0d1220] rounded-2xl border border-[#1e2a3a] p-5">
            <p className="text-xs font-semibold text-[#334155] uppercase tracking-widest mb-4">Keystroke Heatmap</p>
            <KeystrokeHeatmap keyFreq={keyFreq} />
          </div>
        </div>

        {/* Behavioral analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BehavioralStats
            consistencyScore={consistencyScore}
            focusDecay={focusDecay}
            burstCount={burstCount}
            pauses={pauses}
            keystrokes={keystrokes}
            elapsed={elapsed}
          />
          <InsightsPanel
            wpm={wpm}
            accuracy={acc === "—" ? 100 : acc}
            burstCount={burstCount}
            pauses={pauses}
            consistencyScore={consistencyScore}
            focusDecay={focusDecay}
            elapsed={elapsed}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WPMChart data={wpmHistory} />
          <KeyFreqChart keyFreq={keyFreq} />
        </div>

        {/* Typing area */}
        <div className="bg-[#0d1220] rounded-2xl border border-[#1e2a3a] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#334155] uppercase tracking-widest">Live Input</p>
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              RECORDING
            </span>
          </div>
          <textarea
            className="w-full h-32 bg-[#080c14] rounded-xl border border-[#1e2a3a] p-4 font-mono text-sm resize-none focus:outline-none focus:border-green-900 text-slate-300 placeholder-[#1e2a3a]"
            placeholder="Type here to generate analytics..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => recordKey(e.key)}
          />
        </div>
      </div>
    </div>
  );
}