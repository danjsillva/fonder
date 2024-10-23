let isInspecting = false; // Estado persistente da inspeção

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "GET_FONTS") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "GET_FONTS" },
        (response) => {
          sendResponse(response);
        },
      );
    });

    return true; // Necessário para usar sendResponse de forma assíncrona
  }

  if (request.message === "START_OBSERVING") {
    isInspecting = true; // Atualiza o estado da inspeção

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "START_OBSERVING" },
        (response) => {
          sendResponse(response);
        },
      );
    });

    return true;
  }

  if (request.message === "STOP_OBSERVING") {
    isInspecting = false; // Atualiza o estado da inspeção

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "STOP_OBSERVING" },
        (response) => {
          sendResponse(response);
        },
      );
    });

    return true;
  }

  if (request.message === "CHECK_INSPECTING_STATE") {
    sendResponse({ isInspecting });

    return true;
  }
});
