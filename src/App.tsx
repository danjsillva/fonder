import { useState, useEffect } from "react";

function App() {
  const [fontsList, setFontsList] = useState<string[]>([]);
  const [isInspecting, setIsInspecting] = useState(false);

  // useEffect para buscar a lista de fontes quando o componente é montado
  useEffect(() => {
    chrome.runtime.sendMessage({ message: "GET_FONTS" }, (response) => {
      if (response && response.data) {
        setFontsList(response.data);
      } else {
        console.log("No fonts found in response", response);
      }
    });
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "CHECK_INSPECTING_STATE" },
      (response) => {
        setIsInspecting(response.isInspecting);
      },
    );
  }, []);

  const startInspection = () => {
    chrome.runtime.sendMessage({ message: "START_OBSERVING" }, (_response) => {
      setIsInspecting(true);
    });
  };

  const stopInspection = () => {
    chrome.runtime.sendMessage({ message: "STOP_OBSERVING" }, (_response) => {
      setIsInspecting(false);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Font Properties</h1>
      {fontsList.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-lg">Fonts Used:</h2>
          <ul>
            {fontsList.map((font, index) => (
              <li key={index}>{font}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No fonts found</p>
      )}

      {isInspecting ? (
        <button onClick={stopInspection}>Stop Inspection</button>
      ) : (
        <button onClick={startInspection}>Start Inspection</button>
      )}
    </div>
  );
}

export default App;
