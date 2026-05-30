const KEYS = "qwertyuiopasdfghjklzxcvbnm ".split("");

export default function KeystrokeHeatmap({ keyFreq }) {
  const max = Math.max(...Object.values(keyFreq), 1);
  return (
    <div className="flex flex-wrap gap-1">
      {KEYS.map(k => {
        const freq = keyFreq[k] || 0;
        const intensity = freq / max;
        return (
          <div
            key={k}
            title={`${k === " " ? "SPACE" : k.toUpperCase()}: ${freq}`}
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-mono border transition-all duration-300"
            style={{
              background: freq > 0 ? `rgba(74,222,128,${0.05 + intensity * 0.3})` : "#131d2e",
              borderColor: freq > 0 ? `rgba(74,222,128,${0.1 + intensity * 0.4})` : "#1e2a3a",
              color: freq > 0 ? `rgba(74,222,128,${0.4 + intensity * 0.6})` : "#334155",
            }}
          >
            {k === " " ? "·" : k.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}