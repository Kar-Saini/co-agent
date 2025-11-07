"use strict";
/// <reference types="chrome" />
chrome.identity.getAuthToken({ interactive: true }, (token) => {
    console.log("Google OAuth Token:", token);
});
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === "analyze-tab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            console.log(tab.url);
            const isSheet = tab?.url?.includes("https://docs.google.com/spreadsheets");
            const status = isSheet ? "sheet" : "not-sheet";
            sendResponse({ status });
        });
        return true;
    }
});
async function readRange(spreadsheetId, range = "Sheet1!A1:D10", token) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
        throw new Error(`Sheets read failed: ${res.status} ${await res.text()}`);
    return res.json(); // contains .values array
}
function extractSpreadsheetId(url) {
    const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return m ? m[1] : null;
}
