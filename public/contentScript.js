let highlightedElement = null;
let isObserving = false;

// Função para destacar o texto com uma cor de marca-texto amarela
function highlightElement(element) {
  if (highlightedElement) {
    highlightedElement.style.backgroundColor = ""; // Remove o destaque anterior
  }
  highlightedElement = element;
  highlightedElement.style.backgroundColor = "yellow"; // Adiciona o destaque
}

// Função para obter as propriedades da fonte do texto sob o mouse
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

  // Destaca o elemento com fundo amarelo
  highlightElement(element);

  return fontProperties;
}

// Função para começar a observar o movimento do mouse
function startObservingMouse() {
  if (!isObserving) {
    document.addEventListener("mousemove", handleMouseMove);
    isObserving = true;
  }
}

// Função para parar de observar o movimento do mouse
function stopObservingMouse() {
  if (isObserving) {
    document.removeEventListener("mousemove", handleMouseMove);
    isObserving = false;
    // Remove o destaque do último elemento
    if (highlightedElement) {
      highlightedElement.style.backgroundColor = ""; // Remove o destaque quando parar de observar
      highlightedElement = null;
    }
  }
}

// Handler para o movimento do mouse
function handleMouseMove(event) {
  const fontProperties = getFontPropertiesUnderMouse(event);
  chrome.runtime.sendMessage({
    message: "font_properties",
    data: fontProperties,
  });
}

// Função para obter todas as fontes usadas na página
function getFontsUsedOnPage() {
  const fonts = new Set();

  // Itera sobre todos os elementos visíveis na página
  document.querySelectorAll("*").forEach((element) => {
    const style = window.getComputedStyle(element);
    const fontFamily = style.fontFamily;

    // Adiciona a fonte se não for uma string vazia
    if (fontFamily && fontFamily !== "inherit") {
      // Divide as famílias de fontes se houver várias
      fontFamily.split(",").forEach((font) => {
        fonts.add(font.trim());
      });
    }
  });

  return Array.from(fonts);
}

// Listener para receber mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "get_fonts") {
    const fonts = getFontsUsedOnPage();
    sendResponse({ fonts });
  } else if (request.message === "start_observing") {
    startObservingMouse();
    sendResponse({ status: "Observing started" });
  } else if (request.message === "stop_observing") {
    stopObservingMouse();
    sendResponse({ status: "Observing stopped" });
  }
});
