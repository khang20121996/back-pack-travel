import travelApi from '../api/backPackTravelApi';
import { setImage } from './common';

export async function initPagination(queryparams, paginationElement) {
  const previousElement = paginationElement.querySelector('[data-id="previous"]');
  const nextElement = paginationElement.querySelector('[data-id="next"]');

  // check queryparams to hide or show
  const data = await travelApi.getAll();
  if (queryparams === 1) {
    previousElement.style.visibility = 'hidden';
    setImage(paginationElement, '[data-id="nextImage"]', data[queryparams].thumbnail);
  }

  if (queryparams > 1 && queryparams < data.length) {
    setImage(paginationElement, '[data-id="nextImage"]', data[queryparams].thumbnail);
    setImage(paginationElement, '[data-id="preImage"]', data[queryparams - 2].thumbnail);
  }

  if (queryparams === data.length) {
    nextElement.style.visibility = 'hidden';
    setImage(paginationElement, '[data-id="preImage"]', data[queryparams - 2].thumbnail);
  }

  // attach event click for next/pre
  if (previousElement) {
    previousElement.addEventListener('click', () => {
      window.location.assign(`/destination-detail.html?id=${queryparams - 1}`);
    });
  }

  if (nextElement) {
    nextElement.addEventListener('click', () => {
      window.location.assign(`/destination-detail.html?id=${queryparams + 1}`);
    });
  }
}
