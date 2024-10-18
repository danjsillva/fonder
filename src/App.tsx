import { useState, useEffect } from "react";

// Definição das interfaces
interface FontProperties {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
  elementText: string;
}

interface FontMessage {
  message: "font_properties";
  data: FontProperties;
}

function App() {
  const [fontProperties, setFontProperties] = useState<FontProperties>({
    fontFamily: "",
    fontSize: "",
    fontWeight: "",
    lineHeight: "",
    color: "",
    elementText: "",
  });

  const [fontsList, setFontsList] = useState<string[]>([]);
  const [isInspecting, setIsInspecting] = useState(false);

  // useEffect para buscar a lista de fontes quando o componente é montado
  useEffect(() => {
    chrome.runtime.sendMessage({ message: "get_fonts" }, (response) => {
      if (response && response.fonts) {
        setFontsList(response.fonts);
      } else {
        console.log("No fonts found in response", response);
      }
    });
  }, []);

  // useEffect para iniciar/parar a inspeção com base no estado
  useEffect(() => {
    if (isInspecting) {
      chrome.runtime.sendMessage({ message: "start_observing" }, (response) => {
        console.log(response?.status); // Logs "Observing started"
      });
    } else {
      chrome.runtime.sendMessage({ message: "stop_observing" }, (response) => {
        console.log(response?.status); // Logs "Observing stopped"
      });
    }

    // Listener para receber propriedades de fonte
    const handleFontPropertiesMessage = (message: FontMessage) => {
      if (message.message === "font_properties") {
        setFontProperties(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(handleFontPropertiesMessage);

    // Limpeza ao desmontar o componente
    return () => {
      chrome.runtime.onMessage.removeListener(handleFontPropertiesMessage);
    };
  }, [isInspecting]);

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
      {fontProperties.elementText ? (
        <div className="space-y-2 mt-4">
          <p>
            <strong>Font Family:</strong> {fontProperties.fontFamily}
          </p>
          <p>
            <strong>Font Size:</strong> {fontProperties.fontSize}
          </p>
          <p>
            <strong>Font Weight:</strong> {fontProperties.fontWeight}
          </p>
          <p>
            <strong>Line Height:</strong> {fontProperties.lineHeight}
          </p>
          <p>
            <strong>Color:</strong> {fontProperties.color}
          </p>
          <p>
            <strong>Text:</strong> {fontProperties.elementText}
          </p>
        </div>
      ) : (
        <p>Hover over text to see font properties</p>
      )}
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => setIsInspecting((prev) => !prev)}
      >
        {isInspecting ? "Stop Inspection" : "Inspect Text"}
      </button>
    </div>
  );
}

export default App;
