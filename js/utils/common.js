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

export function setRating(parent, selector, rate) {
  if (rate < 0) return;
  const listRating = parent.querySelector(selector);

  for (let i = 1; i <= 5; i++) {
    if (i <= rate) {
      const activeElement = document.createElement('i');
      activeElement.classList.add('fa-solid');
      activeElement.classList.add('fa-star');
      listRating.appendChild(activeElement);
    } else {
      const activeElement = document.createElement('i');
      activeElement.classList.add('fa-regular');
      activeElement.classList.add('fa-star');
      listRating.appendChild(activeElement);
    }
  }
}
