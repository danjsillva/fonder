chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.message === "GET_FONTS" ||
    message.message === "START_OBSERVING" ||
    message.message === "STOP_OBSERVING"
  ) {
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

    // Keep the communication channel open for sendResponse
    return true;
  }
});
