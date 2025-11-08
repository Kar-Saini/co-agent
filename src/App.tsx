import { useState } from "react";

export default function App() {
  const [enabled, setEnabled] = useState(false);

  const toggleAgent = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;

    if (!enabled) {
      chrome.tabs.sendMessage(tab.id, { action: "inject_ui" });
    } else {
      chrome.tabs.sendMessage(tab.id, { action: "remove_ui" });
    }
    setEnabled(!enabled);
  };

  return (
    <div style={{ width: 280, padding: 16 }}>
      <h3>🧠 Co-Agent</h3>
      <button
        onClick={toggleAgent}
        style={{
          background: enabled ? "#ef4444" : "#22c55e",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {enabled ? "Disable Agent" : "Enable Agent"}
      </button>
    </div>
  );
}
