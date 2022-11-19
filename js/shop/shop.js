import { shopApi } from '../api/backPackTravelApi';
import { setImage, setTextContent, setRating } from '../utils/common';
import debounce from 'lodash.debounce';

function createProductElement(product) {
  // get template product element and clone
  const templateElement = document.getElementById('templateProduct');
  if (!templateElement) return;
  const liElement = templateElement.content.firstElementChild.cloneNode(true);

  // set text content for li element
  setImage(liElement, '[data-id="thumbnail"]', product.image);
  setTextContent(liElement, '[data-id="name"]', product.name);
  setTextContent(liElement, '[data-id="price"]', product.price);
  setRating(liElement, '[data-id="listRating"]', product.rating);
  liElement.dataset.id = product.id;

  //  attach event click for li element
  const productItemElement = liElement.querySelector('[data-id="productItem"]');
  if (productItemElement) {
    // const debounceSearch = debounce(
    //   () => window.open(`../shop/product-detail.html?id=${product.id}`, '_blank'),
    //   500
    // );
    // productItemElement.addEventListener('click', debounceSearch);
    productItemElement.addEventListener('mousedown', () => {
      productItemElement.href = `../shop/product-detail.html?id=${product.id}`;
    });
  }

  return liElement;
}

export function renderProducts(productList, ulElementId) {
  if (!productList || !Array.isArray(productList)) return;
  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return;

  // reset list product when using sorting function
  ulElement.innerHTML = '';

  productList.forEach((product) => {
    const liElement = createProductElement(product);
    ulElement.appendChild(liElement);
  });
}

function sortedByRating(productList) {
  // use bubble sort to sort the array
  let i, j, temp;
  let swapped;
  const n = productList.length;
  for (i = 0; i < n - 1; i++) {
    swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      if (productList[j].rating < productList[j + 1].rating) {
        // swap productList[j] and productList[j+1]
        temp = productList[j];
        productList[j] = productList[j + 1];
        productList[j + 1] = temp;
        swapped = true;
      }
    }

    // IF no two elements were
    // swapped by inner loop, then break
    if (swapped == false) break;
  }

  return productList;
}

function sortedByPriceLowToHight(productList) {
  // use bubble sort to sort the array
  let i, j, temp;
  let swapped;
  const n = productList.length;
  for (i = 0; i < n - 1; i++) {
    swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      if (productList[j].price > productList[j + 1].price) {
        // swap productList[j] and productList[j+1]
        temp = productList[j];
        productList[j] = productList[j + 1];
        productList[j + 1] = temp;
        swapped = true;
      }
    }

    // IF no two elements were
    // swapped by inner loop, then break
    if (swapped == false) break;
  }

  return productList;
}

function sortedByPriceHightToLow(productList) {
  // use bubble sort to sort the array
  let i, j, temp;
  let swapped;
  const n = productList.length;
  for (i = 0; i < n - 1; i++) {
    swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      if (productList[j].price < productList[j + 1].price) {
        // swap productList[j] and productList[j+1]
        temp = productList[j];
        productList[j] = productList[j + 1];
        productList[j + 1] = temp;
        swapped = true;
      }
    }

    // IF no two elements were
    // swapped by inner loop, then break
    if (swapped == false) break;
  }

  return productList;
}

function initSortingProduct(productList) {
  // clone product list
  const newProductList = [...productList];

  const listSortingElement = document.getElementById('listSorting');
  const sortingElement = document.getElementById('sortingElement');
  if (!listSortingElement) return;

  // sorting by defaut
  const sortDefault = listSortingElement.querySelector('[data-id="sortDefault"]');
  if (sortDefault) {
    sortDefault.addEventListener('click', () => {
      renderProducts(productList);
      sortingElement.innerHTML = sortDefault.innerHTML;
    });
  }

  // sorting by rate
  const sortRatingElement = listSortingElement.querySelector('[data-id="sortRating"]');
  if (sortRatingElement) {
    sortRatingElement.addEventListener('click', () => {
      sortedByRating(newProductList);
      renderProducts(newProductList);
      sortingElement.innerHTML = sortRatingElement.innerHTML;
    });
  }

  // sorting by price
  const sortLowToHightElement = listSortingElement.querySelector('[data-id="sortLowToHight"]');
  if (sortLowToHightElement) {
    sortLowToHightElement.addEventListener('click', () => {
      sortedByPriceLowToHight(newProductList);
      renderProducts(newProductList);
      sortingElement.innerHTML = sortLowToHightElement.innerHTML;
    });
  }

  const sortHightToLowElement = listSortingElement.querySelector('[data-id="sortHightToLow"]');
  if (sortHightToLowElement) {
    sortHightToLowElement.addEventListener('click', () => {
      sortedByPriceHightToLow(newProductList);
      renderProducts(newProductList);
      sortingElement.innerHTML = sortHightToLowElement.innerHTML;
    });
  }
}

(async () => {
  // Call API get data
  // Render products to DOM
  try {
    const productList = await shopApi.getAll();
    renderProducts(productList, 'productList');
    initSortingProduct(productList);
  } catch (error) {}
})();
