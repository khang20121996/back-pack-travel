export function setTextContent(parent, selector, text) {
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function setImage(parent, selector, url) {
  const element = parent.querySelector(selector);
  if (element) element.src = url;

  element.addEventListener('error', () => {
    element.src = 'https://via.placeholder.com/728x90.png?text=thumbnail';
  });
}
