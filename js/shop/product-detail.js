import { shopApi } from '../api/backPackTravelApi';
import { setImage, setRating, setTextContent } from '../utils/common';
import { initShopReviews } from '../utils/shop-review';

function renderProduct(product) {
  // get selector
  const productElement = document.getElementById('product');
  if (!productElement) return;

  // set text content to product
  setImage(productElement, '[data-id="image"]', product.image);
  setRating(productElement, '[data-id="rating"]', product.rating);
  setTextContent(productElement, '[data-id="name"]', product.name);
  setTextContent(productElement, '[data-id="price"]', product.price);
  setTextContent(productElement, '[data-id="description"]', product.description);
  const tabContentElement = document.getElementById('myTabContent');

  setTextContent(tabContentElement, '[data-id="description"]', product.description);
  setTextContent(tabContentElement, '[data-id="weight"]', product.additionalInfor[0].weight);
  setTextContent(
    tabContentElement,
    '[data-id="dimensions"]',
    product.additionalInfor[1].dimensions
  );

  setTextContent(
    document.getElementById('myTab'),
    '[data-id="numOfComments"]',
    product.review.length
  );

  // handle review element
  initShopReviews(product);
}

function createRelatedProductElement(product) {
  const templateElement = document.getElementById('templateRelatedProd');
  if (!templateElement) return;
  const liElement = templateElement.content.firstElementChild.cloneNode(true);

  // set text content for li element
  setImage(liElement, '[data-id="thumbnail"]', product.image);
  setTextContent(liElement, '[data-id="name"]', product.name);
  setTextContent(liElement, '[data-id="price"]', product.price);
  setRating(liElement, '[data-id="listRating"]', product.rating);
  liElement.dataset.id = product.id;

  const productItemElement = liElement.querySelector('[data-id="productItem"]');
  if (productItemElement) {
    productItemElement.addEventListener('mousedown', () => {
      productItemElement.href = `../shop/product-detail.html?id=${product.id}`;
    });
  }

  return liElement;
}

function renderRelatedProduct(relatedProdList) {
  if (!relatedProdList || !Array.isArray(relatedProdList)) return;
  const ulElement = document.getElementById('relatedProdList');
  if (!ulElement) return;

  // reset list product when using sorting function
  ulElement.innerHTML = '';

  relatedProdList.forEach((product) => {
    const liElement = createRelatedProductElement(product);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const url = new URL(window.location);
    const queryparams = url.searchParams.get('id');
    const product = await shopApi.getById(queryparams);

    const productList = await shopApi.getAll();
    const relatedProdList = [];
    let j = 0;
    for (let i = Number(queryparams); i < Number(queryparams) + 4; i++) {
      if (i < 9) {
        relatedProdList.push(productList[i]);
      } else {
        relatedProdList.push(productList[j]);
        j++;
      }
    }

    renderProduct(product);
    renderRelatedProduct(relatedProdList);
  } catch (error) {}
})();
