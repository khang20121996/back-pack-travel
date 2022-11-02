import travelApi from './api/backPackTravelApi';
import {
  budgetTipsApi,
  commentListApi,
  relatedArticlesApi,
  thingsToSeeApi,
  typicalCostsApi,
} from './api/destinationDetailApi';
import {
  initBackToTopButton,
  setImage,
  setTextContent,
  initPagination,
  initPostComments,
} from './utils';
import dayjs from 'dayjs';

async function renderBanner(queryparams) {
  // get selector
  // call API and set data for each component
  try {
    const data = await travelApi.getById(queryparams);
    const banner = data.thumbnail;
    const bannerElement = document.querySelector('[data-id="banner"');

    if (bannerElement) {
      bannerElement.src = banner;
    }

    setTextContent(
      document.getElementById('contentFooter'),
      '[data-id="date"]',
      dayjs(data.updatedAt).format('MMMM DD, YYYY')
    );
    const paginationElement = document.getElementById('contentFooterPagination');
  } catch (error) {
    console.log('get fail data', error);
  }
}

function renderThingsToSeeList(thingToSeeElement, data) {
  if (!thingToSeeElement) return;

  // clone li element and append to things to see list
  const templateElement = thingToSeeElement.querySelector('[data-id="thingsToSeeList"]');
  const thingsToSeeList = document.getElementById('thingsToSeeList');

  if (templateElement) {
    const liElement = templateElement.content.firstElementChild.cloneNode(true);
    liElement.textContent = data;
    thingsToSeeList.appendChild(liElement);
  }
}

async function renderThingsToSee(queryparams) {
  try {
    const thingToSeeElement = document.getElementById('thingsToSee');
    const data = await thingsToSeeApi.getByParentId(queryparams);

    if (thingToSeeElement) {
      // get selector
      setTextContent(thingToSeeElement, '[data-id="nation"]', data[0].national);
      setTextContent(thingToSeeElement, '[data-id="title-1"]', data[0].title);
      setTextContent(thingToSeeElement, '[data-id="title-2"]', data[0].titleList);
      setImage(thingToSeeElement, '[data-id="image-1"]', data[0].img1);
      setImage(thingToSeeElement, '[data-id="image-2"]', data[0].img2);
      data[0].list.forEach((data) => {
        renderThingsToSeeList(thingToSeeElement, data);
      });
    }
  } catch (error) {
    console.log('get fail data', error);
  }
}

async function renderTypicalCosts(queryparams) {
  try {
    const typicalCostElement = document.getElementById('typicalCosts');
    const data = await typicalCostsApi.getByParentId(queryparams);

    setTextContent(typicalCostElement, '[data-id="accommodation"]', data[0].accommodation);
    setTextContent(typicalCostElement, '[data-id="food"]', data[0].food);
    setTextContent(typicalCostElement, '[data-id="transportation"]', data[0].transportation);
    setTextContent(
      typicalCostElement,
      '[data-id="suggestedDailyBudget"]',
      data[0].suggestedDailyBudget
    );
    setImage(typicalCostElement, '[data-id="typicalCostsImg"]', data[0].typicalCostImg);
  } catch (error) {
    console.log('get fail data', error);
  }
}

async function renderBudgetTips(queryparams) {
  try {
    const budgetTipsElement = document.getElementById('budgetTips');
    const data = await budgetTipsApi.getByParentId(queryparams);

    setTextContent(budgetTipsElement, '[data-id="getTheMenu"]', data[0].getTheMenu);
    setTextContent(budgetTipsElement, '[data-id="rideWithUber"]', data[0].rideWithUber);
    setTextContent(budgetTipsElement, '[data-id="getCityPasses"]', data[0].getCityPasses);
    setTextContent(budgetTipsElement, '[data-id="couchsurf"]', data[0].couchsurf);
  } catch (error) {
    console.log('get fail data', error);
  }
}

async function handleAmountHearts(contentFooterElement, heartsButton, data) {
  const heartsAbleButton = contentFooterElement.querySelector('[data-id="heartAble"]');
  const amountHeartElement = contentFooterElement.querySelector('[data-id="amountHeart"]');
  const amountHeart = amountHeartElement.innerText;

  // set text content and change icon heart
  amountHeartElement.textContent = Number.parseFloat(amountHeart) + 1;
  heartsButton.style.display = 'none';
  heartsAbleButton.style.display = 'block';

  // call API and set amount of hearts
  data.hearts = amountHeartElement.innerText;
  await relatedArticlesApi.update(data);
}

async function renderRelatedArticles(queryparams) {
  try {
    const relatedArticlesElement = document.getElementById('relatedArticles');
    const contentFooterElement = document.getElementById('contentFooter');

    const data = await relatedArticlesApi.getByParentId(queryparams);

    setTextContent(relatedArticlesElement, '[data-id="title-1"]', data[0].title);
    setTextContent(relatedArticlesElement, '[data-id="description1"]', data[0].description1);
    setTextContent(relatedArticlesElement, '[data-id="description2"]', data[0].description2);

    for (let i = 0; i < data[0].categories.length; i++) {
      setTextContent(contentFooterElement, `[data-id="category${i}"]`, data[0].categories[i]);
    }

    setTextContent(contentFooterElement, '[data-id="amountHeart"]', data[0].hearts);

    // attach event for hearts button
    const heartsButton = contentFooterElement.querySelector('[data-id="heart"]');
    if (heartsButton) {
      heartsButton.addEventListener('click', () => {
        handleAmountHearts(contentFooterElement, heartsButton, data[0]);
      });
    }
  } catch (error) {
    console.log('get fail data', error);
  }
}

(() => {
  // get query search params
  const url = new URL(window.location);
  const queryparams = url.searchParams.get('id');

  //   render to UI
  renderBanner(Number.parseFloat(queryparams));
  renderThingsToSee(queryparams);
  renderTypicalCosts(queryparams);
  renderBudgetTips(queryparams);
  renderRelatedArticles(queryparams);
  initPostComments(Number.parseFloat(queryparams));

  // attach event pagination (next/previous)
  const paginationElement = document.getElementById('contentFooterPagination');
  initPagination(Number.parseFloat(queryparams), paginationElement);

  // attach event back to top button
  const backToTopBtn = document.getElementById('backToTop');
  initBackToTopButton(backToTopBtn);
})();
