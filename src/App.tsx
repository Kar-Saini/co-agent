import { useState } from "react";

export default function App() {
  const [analyze, setAnalyze] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze() {
    chrome.runtime.sendMessage({ action: "analyze-tab" }, (response) => {
      setResponse(response.status);
    });
  }

  return (
    <div>
      <h1>Co Agent</h1>
      <button>Analyze</button>
      <button>Authenticate</button>
    </div>
  );
}
