import { shopApi } from '../api/backPackTravelApi';

function renderProduct(product) {}

(async () => {
  try {
    const url = new URL(window.location);
    const queryparams = url.searchParams.get('id');
    const product = shopApi.getById(queryparams);

    renderProduct(product);
  } catch (error) {}
})();
