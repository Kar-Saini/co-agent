import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function App() {
    const [analyze, setAnalyze] = useState(false);
    const [status, setStatus] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [sheets, setSheets] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState("");
    const [prompt, setPrompt] = useState("");
    const [generated, setGenerated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("analyze");
    useEffect(() => {
        chrome.runtime.sendMessage({ action: "check-auth" }, (response) => {
            setAuthenticated(response?.authenticated || false);
            if (response?.authenticated) {
                loadSheets();
            }
        });
    }, []);
    const loadSheets = () => {
        chrome.runtime.sendMessage({ action: "list-sheets" }, (response) => {
            if (response?.sheets) {
                setSheets(response.sheets);
                if (response.sheets.length > 0) {
                    setSelectedSheet(response.sheets[0].id);
                }
            }
        });
    };
    const handleLogin = () => {
        setLoading(true);
        chrome.runtime.sendMessage({ action: "auth-login" }, (response) => {
            if (response?.success) {
                setAuthenticated(true);
                loadSheets();
            }
            setLoading(false);
        });
    };
    const handleLogout = () => {
        chrome.runtime.sendMessage({ action: "auth-logout" }, () => {
            setAuthenticated(false);
            setSheets([]);
            setSelectedSheet("");
            setGenerated(null);
        });
    };
    useEffect(() => {
        if (analyze) {
            chrome.runtime.sendMessage({ action: "analyze-tab" }, (response) => {
                setStatus(response?.status || "");
            });
        }
    }, [analyze]);
    const handleGenerate = () => {
        if (!prompt.trim() || !selectedSheet)
            return;
        setLoading(true);
        chrome.runtime.sendMessage({
            action: "generate-data",
            prompt: prompt,
            sheetId: selectedSheet,
        }, (response) => {
            setGenerated({
                content: response?.data || "",
                error: response?.error,
            });
            setLoading(false);
        });
    };
    const handleInsert = () => {
        if (!generated?.content || !selectedSheet)
            return;
        setLoading(true);
        chrome.runtime.sendMessage({
            action: "insert-data",
            data: generated.content,
            sheetId: selectedSheet,
        }, (response) => {
            if (response?.success) {
                setPrompt("");
                setGenerated(null);
                setStatus("✅ Data inserted successfully");
                setTimeout(() => setStatus(""), 2000);
            }
            else {
                setGenerated({
                    content: generated.content,
                    error: response?.error || "Failed to insert data",
                });
            }
            setLoading(false);
        });
    };
    return (_jsxs("div", { style: { width: 380, padding: 16, fontFamily: "system-ui, sans-serif" }, children: [_jsxs("div", { style: {
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: "1px solid #e0e0e0",
                }, children: [_jsx("h3", { style: { margin: "0 0 8px 0", fontSize: 18 }, children: "\uD83E\uDDE0 Co-Agent" }), _jsx("p", { style: { margin: 0, fontSize: 12, color: "#666" }, children: "AI-powered Google Sheets enhancement" })] }), !authenticated ? (_jsxs("div", { style: {
                    padding: 12,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 8,
                    marginBottom: 16,
                }, children: [_jsx("p", { style: { margin: "0 0 8px 0", fontSize: 14 }, children: "Sign in to get started" }), _jsx("button", { onClick: handleLogin, disabled: loading, style: {
                            width: "100%",
                            padding: "8px 12px",
                            backgroundColor: "#1f2937",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                        }, children: loading ? "Signing in..." : "Sign in with Google" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { style: {
                            display: "flex",
                            gap: 8,
                            marginBottom: 16,
                            borderBottom: "1px solid #e0e0e0",
                        }, children: ["analyze", "generate", "modify"].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab), style: {
                                padding: "8px 12px",
                                backgroundColor: activeTab === tab ? "#1f2937" : "transparent",
                                color: activeTab === tab ? "white" : "#666",
                                border: "none",
                                borderRadius: "4px 4px 0 0",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 500,
                            }, children: [tab === "analyze" && "Analyze", tab === "generate" && "Generate", tab === "modify" && "Modify"] }, tab))) }), activeTab === "analyze" && (_jsxs("div", { style: { marginBottom: 12 }, children: [_jsxs("label", { style: {
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }, children: [_jsx("input", { type: "checkbox", checked: analyze, onChange: (e) => setAnalyze(e.target.checked), style: { marginRight: 8, cursor: "pointer" } }), _jsx("span", { style: { fontSize: 14 }, children: "Analyze current tab" })] }), analyze && (_jsx("p", { style: { marginTop: 8, fontSize: 13, color: "#666" }, children: status === "sheet"
                                    ? "✅ This is a Google Sheet"
                                    : status === "analyzing"
                                        ? "⏳ Analyzing..."
                                        : "❌ Not a Google Sheet" }))] })), (activeTab === "generate" || activeTab === "modify") && (_jsxs("div", { children: [_jsxs("div", { style: { marginBottom: 12 }, children: [_jsx("label", { style: {
                                            display: "block",
                                            fontSize: 12,
                                            fontWeight: 500,
                                            marginBottom: 4,
                                        }, children: "Sheet" }), _jsxs("select", { value: selectedSheet, onChange: (e) => setSelectedSheet(e.target.value), style: {
                                            width: "100%",
                                            padding: "6px 8px",
                                            borderRadius: 4,
                                            border: "1px solid #d0d0d0",
                                            fontSize: 12,
                                        }, children: [_jsx("option", { value: "", children: "Select a sheet..." }), sheets.map((sheet) => (_jsx("option", { value: sheet.id, children: sheet.title }, sheet.id)))] })] }), _jsxs("div", { style: { marginBottom: 12 }, children: [_jsx("label", { style: {
                                            display: "block",
                                            fontSize: 12,
                                            fontWeight: 500,
                                            marginBottom: 4,
                                        }, children: activeTab === "generate"
                                            ? "Generate with prompt"
                                            : "Modify data" }), _jsx("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: activeTab === "generate"
                                            ? "e.g., Create a customer list with names and email addresses..."
                                            : "e.g., Sort by date, remove duplicates...", style: {
                                            width: "100%",
                                            minHeight: 80,
                                            padding: 8,
                                            borderRadius: 4,
                                            border: "1px solid #d0d0d0",
                                            fontSize: 12,
                                            fontFamily: "inherit",
                                            resize: "vertical",
                                        } })] }), _jsx("button", { onClick: handleGenerate, disabled: !selectedSheet || !prompt.trim() || loading, style: {
                                    width: "100%",
                                    padding: "8px 12px",
                                    backgroundColor: !selectedSheet || !prompt.trim() ? "#ccc" : "#1f2937",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: loading || !selectedSheet || !prompt.trim()
                                        ? "not-allowed"
                                        : "pointer",
                                    fontSize: 13,
                                    fontWeight: 500,
                                }, children: loading ? "Processing..." : "Generate with AI" }), generated && (_jsx("div", { style: {
                                    marginTop: 12,
                                    padding: 12,
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: 4,
                                }, children: generated.error ? (_jsxs("p", { style: { margin: 0, color: "#d32f2f", fontSize: 12 }, children: ["\u274C ", generated.error] })) : (_jsxs(_Fragment, { children: [_jsx("p", { style: {
                                                margin: "0 0 8px 0",
                                                fontSize: 12,
                                                color: "#666",
                                            }, children: "Generated data:" }), _jsx("pre", { style: {
                                                margin: 0,
                                                padding: 8,
                                                backgroundColor: "white",
                                                borderRadius: 3,
                                                fontSize: 11,
                                                overflow: "auto",
                                                maxHeight: 150,
                                                border: "1px solid #e0e0e0",
                                            }, children: generated.content }), _jsx("button", { onClick: handleInsert, disabled: loading, style: {
                                                width: "100%",
                                                marginTop: 8,
                                                padding: "6px 12px",
                                                backgroundColor: "#2e7d32",
                                                color: "white",
                                                border: "none",
                                                borderRadius: 4,
                                                cursor: loading ? "not-allowed" : "pointer",
                                                fontSize: 12,
                                                fontWeight: 500,
                                            }, children: loading ? "Inserting..." : "Insert into Sheet" })] })) })), status && (_jsx("p", { style: { marginTop: 8, fontSize: 12, color: "#2e7d32" }, children: status }))] })), _jsx("div", { style: {
                            marginTop: 16,
                            paddingTop: 12,
                            borderTop: "1px solid #e0e0e0",
                        }, children: _jsx("button", { onClick: handleLogout, style: {
                                fontSize: 12,
                                backgroundColor: "transparent",
                                color: "#d32f2f",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }, children: "Sign out" }) })] }))] }));
}
