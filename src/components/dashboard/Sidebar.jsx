import { motion } from "framer-motion";

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "tracker",   label: "Tracker" },
    { id: "history",   label: "History" },
  ];

  return (
    <aside className="w-52 min-h-screen bg-[#0d1220] border-r border-[#1e2a3a] flex flex-col p-4 shrink-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 mt-1"
      >
        <p className="text-xs font-mono text-green-400 tracking-widest uppercase">CogLoad</p>
        <p className="text-[10px] text-[#334155] font-mono mt-1">v2.0 · week 4</p>
      </motion.div>

      <nav className="flex flex-col gap-1">
        {tabs.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors
              ${activeTab === t.id
                ? "bg-green-950 text-green-400 font-medium"
                : "text-slate-500 hover:bg-[#131d2e] hover:text-slate-300"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              activeTab === t.id ? "bg-green-400 animate-pulse" : "bg-current"
            }`} />
            {t.label}
          </motion.button>
        ))}
      </nav>
      <div className="mt-auto text-[10px] text-[#1e2a3a] font-mono">week 4 · polish</div>
    </aside>
  );
}