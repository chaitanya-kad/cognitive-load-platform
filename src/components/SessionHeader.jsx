// Props: sessionId, status
export default function SessionHeader({ sessionId, status }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Typing Tracker</h1>
        <p className="text-sm text-gray-400">Cognitive Load Platform — Week 1</p>
      </div>
      <span className="text-xs font-mono bg-gray-100 border px-3 py-1 rounded-lg">
        {status} · #{sessionId}
      </span>
    </div>
  );
}