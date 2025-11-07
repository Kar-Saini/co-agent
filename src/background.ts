/// <reference types="chrome" />

chrome.identity.getAuthToken({ interactive: true }, (token) => {
  console.log("Google OAuth Token:", token);
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "analyze-tab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      console.log(tab.url);
      const isSheet = tab?.url?.includes(
        "https://docs.google.com/spreadsheets"
      );
      const status = isSheet ? "sheet" : "not-sheet";
      sendResponse({ status });
    });
    return true;
  }
});
