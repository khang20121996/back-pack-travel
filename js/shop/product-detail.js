import { cartApi, shopApi } from '../api/backPackTravelApi';
import { setImage, setRating, setTextContent } from '../utils/common';
import { handleNavShopMenu } from '../utils/navmenu-shop';
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

  console.log(product.name);
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

function getCartValues(product, formElement) {
  let cartValues = {};
  // get number of product
  const numOfProductElement = formElement.querySelector('[data-id="numbOfPro"]');
  cartValues.amount = Number(numOfProductElement.value);
  cartValues.image = product.image;
  cartValues.name = product.name;
  cartValues.price = product.price;
  cartValues.id = Math.floor(Math.random() * Date.now());
  cartValues.prodId = product.id;

  return cartValues;
}

function pendingAddToCart(formElement, content) {
  const addedToCartButton = formElement.querySelector('[data-id="addToCartBtn"]');
  if (addedToCartButton) {
    addedToCartButton.textContent = content;
  }
}

function handleSuccessAddToCart(numbOfPro, product) {
  const addedToCartElement = document.getElementById('addedToCart');
  if (addedToCartElement) {
    setTextContent(addedToCartElement, '[data-id="nameCart"]', product.name);
    addedToCartElement.style.display = 'block';
  }

  const cartAmountElementList = document.querySelectorAll('.cart-amount');
  if (cartAmountElementList) {
    [...cartAmountElementList].forEach((cartAmountElement) => {
      const currentAmount = cartAmountElement.textContent;
      cartAmountElement.textContent = Number(currentAmount) + numbOfPro;
    });
  }
}

function handleViewCart() {
  // attach event for view cart
  const viewCartElementList = document.querySelectorAll('.view__cart');
  if (viewCartElementList) {
    viewCartElementList.forEach((viewCartElement) => {
      viewCartElement.addEventListener('mousedown', (e) => {
        e.preventDefault();
        viewCartElement.href = './cart.html';
      });
    });
  }
}

function initAddToCart(product, formId) {
  const formElement = document.getElementById(formId);
  if (!formElement) return;

  // attach event for add to cart button

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
      const cartValues = getCartValues(product, formElement);
      const data = JSON.stringify(cartValues);
      pendingAddToCart(formElement, 'adding to cart...');

      setTimeout(async () => {
        await cartApi.add(data);

        handleSuccessAddToCart(cartValues.amount, product);
        pendingAddToCart(formElement, 'add to cart');
      }, 1000);
    } catch (error) {
      console.log('error adding product to cart');
    }
  });

  handleViewCart();
}

export function renderNumbOfProdIcon(cartList) {
  const cartAmountElementList = document.querySelectorAll('.cart-amount');
  if (cartAmountElementList) {
    [...cartAmountElementList].forEach((cartAmountElement) => {
      cartAmountElement.textContent = cartList.length;
    });
  }
}

(async () => {
  try {
    const url = new URL(window.location);
    const queryparams = url.searchParams.get('id');
    const product = await shopApi.getById(queryparams);
    renderProduct(product);

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
    renderRelatedProduct(relatedProdList);

    const cartList = await cartApi.getAll();
    renderNumbOfProdIcon(cartList);
    initAddToCart(product, 'formAddToCart');
    handleNavShopMenu();
  } catch (error) {}
})();
