import { cartApi } from '../api/backPackTravelApi';
import { setImage, setTextContent } from '../utils/common';

function handleRemoveCartItem(cartItemElement) {
  const removeCartButton = cartItemElement.querySelector('[data-id="removeCart"]');
  if (removeCartButton) {
    removeCartButton.addEventListener('click', () => {
      cartItemElement.textContent = '';
      console.log(cartItemElement);
    });
  }
}

function createCartItem(cartItem) {
  const templateCartItem = document.getElementById('templateCartItem');
  if (!templateCartItem) return;
  const cartItemElement = templateCartItem.content.firstElementChild.cloneNode(true);
  setImage(cartItemElement, '[data-id="thumbnail"]', cartItem.image);
  setTextContent(cartItemElement, '[data-id="name"]', cartItem.name);
  setTextContent(cartItemElement, '[data-id="price"]', cartItem.price);

  const numOfProdElement = cartItemElement.querySelector('[data-id="numbOfPro"]');
  if (numOfProdElement) {
    numOfProdElement.value = cartItem.amount;
  }

  // attach event for remove cart button
  handleRemoveCartItem(cartItemElement);

  return cartItemElement;
}

function renderCartList(cartList) {
  if (!cartList || !Array.isArray(cartList)) return;

  const listCartElement = document.getElementById('listCart');
  if (listCartElement) {
    cartList.forEach((cartItem) => {
      const cartItemElement = createCartItem(cartItem);
      listCartElement.appendChild(cartItemElement);
    });
  }
}

(async () => {
  try {
    const cartList = await cartApi.getAll();
    renderCartList(cartList);
    console.log(cartList);
  } catch (error) {}
})();
