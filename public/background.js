chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.message === "get_fonts" ||
    message.message === "start_observing" ||
    message.message === "stop_observing"
  ) {
    // Envia a mensagem para o content script na aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError.message);
          }
          sendResponse(response);
        });
      }
    });
    return true; // Mantém o canal de comunicação aberto para sendResponse
  }
});
