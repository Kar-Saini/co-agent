import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
let rootElement = null;
let root;
// Function to inject button
function injectButton() {
    if (rootElement)
        return; // Already injected
    rootElement = document.createElement("div");
    rootElement.id = "co_agent";
    rootElement.style.position = "fixed";
    rootElement.style.top = "20px";
    rootElement.style.right = "20px";
    rootElement.style.zIndex = "9999";
    document.body.append(rootElement);
    root = createRoot(rootElement);
    root.render(_jsx("button", { style: {
            padding: "8px 12px",
            background: "#4285f4",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
        }, onClick: () => alert("👋 Hello from Co-Agent!"), children: "Co-Agent" }));
    console.log("✅ Co-Agent UI injected");
}
// Function to remove button
function removeButton() {
    if (!rootElement)
        return;
    root.unmount();
    rootElement.remove();
    rootElement = null;
    console.log("❌ Co-Agent UI removed");
}
// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "inject_ui") {
        injectButton();
    }
    else if (message.action === "remove_ui") {
        removeButton();
    }
});
