import { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import SessionHeader from "./SessionHeader";
import KeystrokeHeatmap from "./KeystrokeHeatmap";
import { useTypingMetrics } from "../hooks/useTypingMetrics";

export default function TypingTracker() {
  const [text, setText] = useState("");
  const { keystrokes, backspaces, keyFreq, elapsed, recordKey, reset } = useTypingMetrics();

  useEffect(() => {
    const wpm = calcWPM();
    if (wpm > 0) console.log(`[CogLoad] WPM update: ${wpm}`);
  }, [text]);

  function calcWPM() {
    if (!elapsed || elapsed < 2000) return 0;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.round(words / (elapsed / 60000));
  }

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <SessionHeader sessionId="001" status={keystrokes > 0 ? "ACTIVE" : "READY"} />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatsCard label="WPM" value={calcWPM()} unit="words/min" accent />
        <StatsCard label="Keystrokes" value={keystrokes} unit="total" />
        <StatsCard label="Backspaces" value={backspaces} unit="corrections" />
        <StatsCard label="Session" value={formatTime(elapsed)} unit="elapsed" />
        <StatsCard
          label="Accuracy"
          value={keystrokes > 0 ? Math.max(0, Math.round(((keystrokes - backspaces) / keystrokes) * 100)) + "%" : "—"}
          unit="% correct"
        />
        <StatsCard label="Unique Keys" value={Object.keys(keyFreq).length} unit="distinct" />
      </div>

      <div className="relative mb-5">
        <span className="absolute top-2 right-3 text-xs text-green-400 font-mono border border-green-900 rounded px-2 py-0.5">
          ● LIVE
        </span>
        <textarea
          className="w-full h-36 rounded-xl border border-[#1e2a3a] bg-[#080c14] text-slate-300 p-4 font-mono text-sm resize-none focus:outline-none focus:border-green-900 placeholder-[#1e2a3a]"
          placeholder="Start typing to measure your cognitive load..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => recordKey(e.key)}
        />
      </div>

      <p className="text-xs text-[#334155] uppercase tracking-widest mb-2">Keystroke Heatmap</p>
      <KeystrokeHeatmap keyFreq={keyFreq} />

      <button
        onClick={() => { reset(); setText(""); }}
        className="mt-5 px-4 py-2 rounded-lg border border-[#1e2a3a] text-sm text-[#334155] hover:bg-[#0d1220] hover:text-slate-300 transition-colors"
      >
        Reset Session
      </button>
    </div>
  );
}