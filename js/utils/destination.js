import { setTextContent, setImage } from './common';
import debounce from 'lodash.debounce';

function createDestinationElement(destination) {
  if (!destination) return;
  // get template and clone li element
  const templateElement = document.getElementById('destinationTemplateItem');
  if (!templateElement) return;

  const liElement = templateElement.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // set text content for element
  setImage(liElement, '[data-id="thumbnail"]', destination.thumbnail);
  setImage(liElement, '[data-id="map"]', destination.imgMap);
  setTextContent(liElement, '[data-id="national"]', destination.national);

  const categoryElementList = liElement.querySelectorAll('[data-id="categoriesTag"]');
  const categoryTagList = destination.categories;
  for (let i = 0; i < categoryTagList.length; i++) {
    categoryElementList[i].textContent =
      i === categoryTagList.length - 1 ? `${categoryTagList[i]}` : `${categoryTagList[i]}/`;
  }

  // attach event for explore button
  const exploreButton = liElement.querySelector('[data-id="exploreBtn"]');
  if (exploreButton) {
    const debounceSearch = debounce(
      () => window.location.assign(`/destination-detail.html?id=${destination.id}`),
      500
    );
    exploreButton.addEventListener('click', debounceSearch);
  }

  return liElement;
}

export function renderDestinationList(destinationList) {
  if (!Array.isArray(destinationList)) return;

  //   loop for each destination to create and append DOM
  const ulElement = document.getElementById('destinationList');

  if (destinationList) {
    destinationList.forEach((destination) => {
      const liElement = createDestinationElement(destination);
      ulElement.appendChild(liElement);
      // console.log(liElement);
    });
  }
}
