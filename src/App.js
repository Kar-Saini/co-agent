import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function App() {
    const [enabled, setEnabled] = useState(false);
    const toggleAgent = async () => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (!tab?.id)
            return;
        if (!enabled) {
            chrome.tabs.sendMessage(tab.id, { action: "inject_ui" });
        }
        else {
            chrome.tabs.sendMessage(tab.id, { action: "remove_ui" });
        }
        setEnabled(!enabled);
    };
    return (_jsxs("div", { style: { width: 280, padding: 16 }, children: [_jsx("h3", { children: "\uD83E\uDDE0 Co-Agent" }), _jsx("button", { onClick: toggleAgent, style: {
                    background: enabled ? "#ef4444" : "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                }, children: enabled ? "Disable Agent" : "Enable Agent" })] }));
}
