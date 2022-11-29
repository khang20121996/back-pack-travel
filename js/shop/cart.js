import { cartApi } from '../api/backPackTravelApi';
import { setImage, setTextContent } from '../utils/common';

function handleRemoveCartItem(cartItemElement, cartItem) {
  const removeCartButton = cartItemElement.querySelector('[data-id="removeCart"]');

  if (removeCartButton) {
    removeCartButton.addEventListener('click', async () => {
      await cartApi.remove(cartItem.id);
      cartItemElement.textContent = '';

      handleTotalCost();
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
  setTextContent(cartItemElement, '[data-id="subTotal"]', cartItem.price * cartItem.amount);

  const numOfProdElement = cartItemElement.querySelector('[data-id="numbOfPro"]');
  if (numOfProdElement) {
    numOfProdElement.value = cartItem.amount;
  }

  // attach event for remove cart button
  handleRemoveCartItem(cartItemElement, cartItem);

  // redirect to product detail
  const detailLinkElement = cartItemElement.querySelector('[data-id="prodDatailLink"]');
  if (detailLinkElement) {
    detailLinkElement.addEventListener('mousedown', () => {
      detailLinkElement.href = `product-detail.html?id=${cartItem.prodId}`;
      console.log(cartItem);
    });
  }

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

function handleTotalCost() {
  const listCartElement = document.getElementById('listCart');
  const totalCostElement = document.getElementById('totalCost');
  if (listCartElement) {
    const subTotalList = listCartElement.querySelectorAll('[data-id="subTotal"]');
    let totalCostList = [];

    subTotalList.forEach((subTotal) => {
      totalCostList.push(Number(subTotal.textContent));
    });

    const totalCost = totalCostList.reduce(
      (accumulator, currentValue) => (currentValue += accumulator),
      0
    );

    totalCostElement.textContent = totalCost;
  }
}

function onChangeTotalCost() {
  const listCartElement = document.getElementById('listCart');
  if (!listCartElement) return;

  const numbOfProdList = listCartElement.querySelectorAll('[data-id="numbOfPro"]');

  numbOfProdList.forEach((numbOfProd) => {
    numbOfProd.addEventListener('change', (e) => {
      if (Number(numbOfProd.value) <= 0 || !Number.isInteger(Number(numbOfProd.value))) {
        numbOfProd.value = '';
      } else {
        const cartItem = e.target.parentElement.parentElement;
        const price = cartItem.querySelector('[data-id="price"]').textContent;
        setTextContent(cartItem, '[data-id="subTotal"]', Number(numbOfProd.value) * price);

        handleTotalCost();
      }
    });
  });
}

function handleDuplicateCartItem(cartList) {
  let uniqueCartList = [
    ...new Map(cartList.map((cartItem) => [cartItem.prodId, cartItem])).values(),
  ];
  let newCartList = [];

  cartList.forEach((cartItem) => {
    if (!uniqueCartList.includes(cartItem)) {
      newCartList.push(cartItem);
    }
  });

  uniqueCartList.forEach((cartItem) => {
    for (let i = 0; i < newCartList.length; i++) {
      if (cartItem.prodId === newCartList[i].prodId) {
        cartItem.amount = newCartList[i].amount + cartItem.amount;
      }
    }
  });

  return uniqueCartList;
}

(async () => {
  try {
    const cartList = await cartApi.getAll();

    const uniqueCartList = handleDuplicateCartItem(cartList);
    renderCartList(uniqueCartList);

    handleTotalCost();
    onChangeTotalCost();
  } catch (error) {
    console.log(error, 'fail');
  }
})();
