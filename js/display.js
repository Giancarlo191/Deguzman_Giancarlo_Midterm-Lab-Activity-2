export function buildElement(tag, { className = "", text = "", attrs = {} } = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  Object.entries(attrs).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

export function showMessage(messageElement, text) {
  messageElement.textContent = text;
}

export function clearMessage(messageElement) {
  messageElement.textContent = "";
}

export function renderCounts({ total, pending, completed }, elements) {
  elements.total.textContent = total;
  elements.pending.textContent = pending;
  elements.completed.textContent = completed;
}