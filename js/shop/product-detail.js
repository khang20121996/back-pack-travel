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

(async () => {
  try {
    const url = new URL(window.location);
    const queryparams = url.searchParams.get('id');
    const product = await shopApi.getById(queryparams);

    renderProduct(product);
  } catch (error) {}
})();
