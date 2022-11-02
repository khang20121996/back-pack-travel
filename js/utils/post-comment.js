import { commentListApi } from '../api/destinationDetailApi';
import { setTextContent, setImage } from './common';
import dayjs from 'dayjs';
import * as yup from 'yup';
// use yup to validation

function renderComment(comment) {
  // clone li element
  // render data to UI
  const templateElement = document.getElementById('commentItemTemp');
  if (!templateElement) return;
  const liElement = templateElement.content.firstElementChild.cloneNode(true);

  setImage(liElement, '[data-id="avatar"]', comment.avatar);
  setTextContent(liElement, '[data-id="author"]', comment.author);
  setTextContent(liElement, '[data-id="content"]', comment.content);
  setTextContent(
    liElement,
    '[data-id="date"]',
    dayjs(comment.createdAt).format('MMMM DD, YYYY, HH:mm:ss')
  );
  liElement.dataset.id = comment.id;

  const removeButtonElement = liElement.querySelector('[data-id="remove"]');
  if (removeButtonElement) {
    removeButtonElement.addEventListener('click', async () => {
      try {
        await commentListApi.remove(comment.id);
        console.log('Remove Success');
      } catch (error) {
        console.log(error);
      }
    });
  }

  return liElement;
}

async function initComments(queryparams) {
  // get data from API
  try {
    const commentList = await commentListApi.getByParentId(queryparams);
    const ulElement = document.getElementById('commentList');

    commentList.forEach((comment) => {
      const liElement = renderComment(comment);
      ulElement.appendChild(liElement);
    });
  } catch (error) {
    console.log('get fail data', error);
  }
}

function getCommentValues(form) {
  const formValues = {};

  // S1 : query each input and add to values object
  //   ['content', 'name', 'email', 'website'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`);
  //     if (field) formValues[name] = field.value;
  //   });

  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function setFiledError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

function getCommentSchema() {
  return yup.object().shape({
    content: yup.string().required('Please enter your comment'),
    author: yup.string().required('Please enter your name!'),
    email: yup.string().required('Please enter your email!').email('Please enter a valid email!'),
    website: yup.string().matches(/[^\s$.?#].[^\s]*$/, {
      message: 'Please enter a valid website!',
      excludeEmptyString: true,
    }),
  });
}

async function validateComment(form, commentValues) {
  try {
    // reset previous errors
    ['content', 'author', 'email', 'website'].forEach((name) => setFiledError(form, name, ''));

    const schema = getCommentSchema();
    await schema.validate(commentValues, { abortEarly: false });
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

function removeUnusedFields(queryparams, commentValues) {
  const payload = {
    idDestination: queryparams,
    avatar: 'https://secure.gravatar.com/avatar/35abd0f841f006c1533f3d113ff172a9?s=96&d=mm&r=g',
    ...commentValues,
  };

  return payload;
}

async function handlePostSubmitComments(queryparams, commentValues) {
  try {
    const payload = removeUnusedFields(queryparams, commentValues);
    const data = JSON.stringify(payload);
    const newComment = await commentListApi.add(data);

    // render new comment to DOM
    const ulElement = document.getElementById('commentList');
    const liElement = renderComment(newComment);
    ulElement.appendChild(liElement);
  } catch (error) {
    console.log('Post comment is fail', error);
  }
}

export function initPostComments(queryparams) {
  // get data from postComment -> add element to API -> apply DOM
  initComments(queryparams);

  const form = document.getElementById('commentsForm');
  if (!form) return;
  let submitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;
    console.log('yaya');

    submitting = true;
    const commentValues = getCommentValues(form);
    const valid = await validateComment(form, commentValues);
    if (valid) await handlePostSubmitComments(queryparams, commentValues);

    // reset value in form when valid
    ['content', 'author', 'email', 'website'].forEach(
      (name) => (form.querySelector(`[name="${name}"]  `).value = '')
    );
    submitting = false;
  });
}
