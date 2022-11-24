import { blogApi } from '../api/backPackTravelApi';
import { setImage, setTextContent } from '../utils/common';

function renderBlog(blog) {
  if (!blog) return;

  const blogElement = document.getElementById('blogContent');
  if (!blogElement) return;

  setImage(blogElement, '[data-id="thumbnail"]', blog.thumbnail);
  setImage(blogElement, '[data-id="image1"]', blog.image1);
  setImage(blogElement, '[data-id="image2"]', blog.image2);

  setTextContent(blogElement, '[data-id="description1"]', blog.description1);
  setTextContent(blogElement, '[data-id="description2"]', blog.description2);
  setTextContent(blogElement, '[data-id="description3"]', blog.description3);
  setTextContent(blogElement, '[data-id="name"]', blog.name);
  setTextContent(blogElement, '[data-id="national"]', blog.national);
  setTextContent(blogElement, '[data-id="tag"]', blog.tag);
  setTextContent(blogElement, '[data-id="maxim"]', blog.maxim);
}

function createLastedBlog(blog) {
  if (!blog) return;

  const templateElement = document.getElementById('templateLastedBlog');
  const liElement = templateElement.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  setTextContent(liElement, '[data-id="name"]', blog.name);
  setImage(liElement, '[data-id="thumbnail"]', blog.thumbnail);

  const blogLinkElement = liElement.querySelector('[data-id="blogLink"]');
  if (blogLinkElement) {
    blogLinkElement.addEventListener('mousedown', () => {
      blogLinkElement.href = `../blog/blog-detail.html?id=${blog.id}`;
    });
  }

  return liElement;
}

function renderLastedBlog(blogList, queryparams) {
  if (!blogList || !Array.isArray(blogList)) return;
  const ulElement = document.getElementById('lastedBlogList');
  if (!ulElement) return;

  blogList.forEach((blog) => {
    if (blog.id !== queryparams) {
      const liElement = createLastedBlog(blog);
      ulElement.appendChild(liElement);
    }
  });
}

(async () => {
  try {
    const url = new URL(window.location);
    const queryparams = url.searchParams.get('id');
    const blog = await blogApi.getById(queryparams);
    const blogList = await blogApi.getAll();

    renderBlog(blog);
    renderLastedBlog(blogList, Number(queryparams));
  } catch (error) {}
})();
