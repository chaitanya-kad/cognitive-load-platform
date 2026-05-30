const BASE_URL = "http://localhost:8000";

export async function saveSession(data) {
  const res = await fetch(`${BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getSessions() {
  const res = await fetch(`${BASE_URL}/sessions`);
  return res.json();
}

export async function getAnalyticsSummary() {
  const res = await fetch(`${BASE_URL}/analytics/summary`);
  return res.json();
}

export async function clearSessions() {
  const res = await fetch(`${BASE_URL}/sessions`, { method: "DELETE" });
  return res.json();
}