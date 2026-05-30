import { useState } from "react";
import Sidebar from "./components/dashboard/Sidebar";
import Dashboard from "./pages/Dashboard";
import TypingTracker from "./components/TypingTracker";
import History from "./pages/History";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "tracker"   && <TypingTracker />}
        {activeTab === "history"   && <History />}
      </main>
    </div>
  );
}