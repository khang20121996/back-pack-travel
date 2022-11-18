import dayjs from 'dayjs';
import { setImage, setRating, setTextContent } from '../utils/common';
import * as yup from 'yup';
import { shopApi } from '../api/backPackTravelApi';

function renderReview(review) {
  const templateElement = document.getElementById('reviewTemplate');
  if (!templateElement) return;

  const liElement = templateElement.content.firstElementChild.cloneNode(true);
  setImage(liElement, '[data-id="avatar"]', review.avatar);
  setTextContent(liElement, '[data-id="author"]', review.reviewName);
  setTextContent(liElement, '[data-id="content"]', review.reviewContent);
  setRating(liElement, '[data-id="rating"]', review.rate);
  setTextContent(
    liElement,
    '[data-id="date"]',
    dayjs(review.createdAt).format('MMMM DD, YYYY, HH:mm:ss')
  );

  return liElement;
}

function handleReviewElement(reviews) {
  const ulElement = document.getElementById('reviewList');
  if (!ulElement) return;

  reviews.forEach((review) => {
    const liElement = renderReview(review);
    ulElement.appendChild(liElement);
  });
}

function handleRatingReview(list) {
  const ratingElementList = [...list];
  const length = ratingElementList.length;

  for (let i = 0; i < length; i++) {
    ratingElementList[i].addEventListener('click', () => {
      for (let j = 0; j <= i; j++) {
        ratingElementList[j].classList.remove('fa-regular');
        ratingElementList[j].classList.add('fa-solid');
      }

      if (i < length - 1) {
        for (let k = i + 1; k < length; k++) {
          if (ratingElementList[k].classList.contains('fa-solid')) {
            ratingElementList[k].classList.remove('fa-solid');
            ratingElementList[k].classList.add('fa-regular');
          }
        }
      }
    });
  }
}

function initReviews() {
  const reviewFormElement = document.getElementById('reviewForm');
  const ratingElementList = reviewFormElement.querySelectorAll('[data-id="rating"]');

  handleRatingReview(ratingElementList);
}

function getReviewValues(form) {
  const formValues = {};

  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  //  get the number of reviews
  let ratingCount = 0;
  const ratingElementList = form.querySelectorAll('[data-id="rating"]');
  [...ratingElementList].forEach((ratingElement) => {
    if (ratingElement.classList.contains('fa-solid')) {
      ratingCount++;
    }
  });

  formValues.rate = ratingCount;

  return formValues;
}

function setFiledError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

function getReviewSchema() {
  return yup.object().shape({
    content: yup.string().required('Please enter your comment'),
    author: yup.string().required('Please enter your name!'),
    email: yup.string().required('Please enter your email!').email('Please enter a valid email!'),
  });
}

async function validateReviews(form, reviewValues) {
  try {
    // reset previous errors
    ['content', 'author', 'email'].forEach((name) => setFiledError(form, name, ''));

    const schema = getReviewSchema();
    await schema.validate(reviewValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ignore if the field is already logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFiledError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function handleFullField(product, reviewValues) {
  const payload = {
    review: product.review.concat([
      {
        idReview: Math.floor(Math.random() * Date.now()),
        avatar: 'https://secure.gravatar.com/avatar/35abd0f841f006c1533f3d113ff172a9?s=96&d=mm&r=g',
        reviewName: reviewValues.author,
        rate: reviewValues.rate,
        reviewContent: reviewValues.content,
        createdAt: Date.now(),
      },
    ]),
  };

  return payload;
}

async function handlePostSubmitViews(product, reviewValues) {
  try {
    // Post new review to data base;
    const payload = handleFullField(product, reviewValues);
    const data = JSON.stringify(payload);
    await shopApi.update(data, product.id);

    // render new review to DOM
    const ulElement = document.getElementById('reviewList');
    const liElement = renderReview(payload.review[payload.review.length - 1]);
    ulElement.appendChild(liElement);
  } catch (error) {
    console.log('Post review is fail', error);
  }
}

export function initShopReviews(product) {
  // get data from postComment -> add element to API -> apply DOM
  handleReviewElement(product.review);
  initReviews();

  const form = document.getElementById('reviewForm');
  if (!form) return;
  let submitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;

    submitting = true;
    const reviewValues = getReviewValues(form);
    // console.log(reviewValues);
    const valid = await validateReviews(form, reviewValues);
    if (valid) await handlePostSubmitViews(product, reviewValues);

    // reset value in form when valid
    ['content', 'author', 'email'].forEach(
      (name) => (form.querySelector(`[name="${name}"]  `).value = '')
    );

    window.scrollTo(0, 1500);

    submitting = false;
  });
}
