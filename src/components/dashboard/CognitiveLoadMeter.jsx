export default function CognitiveLoadMeter({ wpm, accuracy, backspaceRate }) {
  // Simple cognitive load score: high backspace rate + low accuracy = high load
  const acc = parseFloat(accuracy) || 100;
  const bsRate = Math.min(backspaceRate * 100, 100);
  const score = Math.round(Math.min(100, bsRate * 0.6 + (100 - acc) * 0.4));

  const level = score < 20 ? "Low" : score < 50 ? "Moderate" : score < 75 ? "High" : "Very High";
  const color = score < 20 ? "bg-green-500" : score < 50 ? "bg-amber-400" : score < 75 ? "bg-orange-500" : "bg-red-500";
  const textColor = score < 20 ? "text-green-600" : score < 50 ? "text-amber-600" : score < 75 ? "text-orange-600" : "text-red-600";

  return (
    <div className="bg-[#0d1220] rounded-2xl border border-[#1e2a3a] p-5">
      <p className="text-xs font-semibold text-[#334155] uppercase tracking-widest mb-4">
        Cognitive Load Index
      </p>
      <div className="flex items-end gap-3 mb-4">
        <p className={`text-4xl font-bold font-mono ${textColor}`}>{score}</p>
        <p className={`text-sm font-semibold mb-1 ${textColor}`}>{level}</p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-300 font-mono">
        <span>Low</span><span>Moderate</span><span>High</span><span>Critical</span>
      </div>
    </div>
  );
}