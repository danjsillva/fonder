let highlightedElement = null;
let isObserving = false;
let fontPopup = null;

// Cria um popup flutuante para exibir as propriedades da fonte
function createFontPopup() {
  fontPopup = document.createElement("div");
  fontPopup.style.position = "absolute";
  fontPopup.style.backgroundColor = "#333";
  fontPopup.style.color = "#fff";
  fontPopup.style.padding = "5px";
  fontPopup.style.borderRadius = "5px";
  fontPopup.style.zIndex = "10000";
  fontPopup.style.fontSize = "12px";
  fontPopup.style.fontFamily = "Arial, sans-serif";
  fontPopup.style.display = "none"; // Inicialmente escondido
  document.body.appendChild(fontPopup);
}

// Função para atualizar e exibir o popup com as propriedades da fonte
function updateFontPopup(fontProperties, mouseX, mouseY) {
  if (fontPopup) {
    fontPopup.innerHTML = `
      <strong>Font Family:</strong> ${fontProperties.fontFamily} <br />
      <strong>Font Size:</strong> ${fontProperties.fontSize} <br />
      <strong>Font Weight:</strong> ${fontProperties.fontWeight} <br />
      <strong>Line Height:</strong> ${fontProperties.lineHeight} <br />
      <strong>Color:</strong> ${fontProperties.color}
    `;

    fontPopup.style.left = `${mouseX + 10}px`; // Posiciona à direita do mouse
    fontPopup.style.top = `${mouseY + 10}px`; // Posiciona um pouco abaixo
    fontPopup.style.display = "block"; // Exibe o popup
  }
}

// Função para esconder o popup
function hideFontPopup() {
  if (fontPopup) {
    fontPopup.style.display = "none";
  }
}

function highlightElement(element) {
  if (highlightedElement) {
    highlightedElement.style.backgroundColor = "";
  }

  highlightedElement = element;
  highlightedElement.style.backgroundColor = "yellow"; // Pode ajustar se preferir não usar o amarelo
}

function getFontPropertiesUnderMouse(event) {
  const element = event.target;
  const style = window.getComputedStyle(element);

  const fontProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    color: style.color,
    elementText: element.innerText,
  };

  highlightElement(element);
  return fontProperties;
}

function startObservingMouse() {
  if (!isObserving) {
    document.addEventListener("mousemove", handleMouseMove);
    isObserving = true;
  }
}

function stopObservingMouse() {
  if (isObserving) {
    document.removeEventListener("mousemove", handleMouseMove);
    isObserving = false;

    if (highlightedElement) {
      highlightedElement.style.backgroundColor = "";
      highlightedElement = null;
    }

    hideFontPopup(); // Esconde o popup quando a observação parar
  }
}

function handleMouseMove(event) {
  const fontProperties = getFontPropertiesUnderMouse(event);

  // Atualiza e mostra o popup
  updateFontPopup(fontProperties, event.pageX, event.pageY);
}

function getAllPageFonts() {
  const fonts = new Set();

  document.querySelectorAll("*").forEach((element) => {
    const style = window.getComputedStyle(element);
    const fontFamily = style.fontFamily;

    if (fontFamily && fontFamily !== "inherit") {
      fontFamily.split(",").forEach((font) => {
        fonts.add(font.trim());
      });
    }
  });

  return Array.from(fonts);
}

// Cria o popup ao iniciar o script
createFontPopup();

// Listener para as mensagens
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "GET_FONTS") {
    const fonts = getAllPageFonts();
    sendResponse({ status: "Fonts obtained", data: fonts });
    return;
  }

  if (request.message === "START_OBSERVING") {
    startObservingMouse();
    sendResponse({ status: "Observing started", data: null });
    return;
  }

  if (request.message === "STOP_OBSERVING") {
    stopObservingMouse();
    sendResponse({ status: "Observing stopped", data: null });
    return;
  }
});
