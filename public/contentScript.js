let highlightedElement = null;
let isObserving = false;

function highlightElement(element) {
  if (highlightedElement) {
    highlightedElement.style.backgroundColor = "";
  }

  highlightedElement = element;
  highlightedElement.style.backgroundColor = "yellow";
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
  }
}

function handleMouseMove(event) {
  const fontProperties = getFontPropertiesUnderMouse(event);

  chrome.runtime.sendMessage({
    message: "font_properties",
    data: fontProperties,
  });
}

function getAllPageFonts() {
  const fonts = new Set();

  document.querySelectorAll("*").forEach((element) => {
    const style = window.getComputedStyle(element);
    const fontFamily = style.fontFamily;

    if (fontFamily && fontFamily !== "inherit") {
      // Split font families if there are multiple
      fontFamily.split(",").forEach((font) => {
        fonts.add(font.trim());
      });
    }
  });

  return Array.from(fonts);
}

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
