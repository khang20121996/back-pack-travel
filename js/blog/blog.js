import { blogApi } from '../api/backPackTravelApi';
import { setImage, setTextContent } from '../utils/common';

function renderMainBlog(mainBlog) {
  if (!mainBlog) return;

  const mainBlogElement = document.getElementById('mainBlog');
  if (!mainBlogElement) return;

  setImage(mainBlogElement, '[data-id="thumbnail"]', mainBlog.thumbnail);
  setTextContent(mainBlogElement, '[data-id="national"]', mainBlog.national);
  setTextContent(mainBlogElement, '[data-id="name"]', mainBlog.name);
  setTextContent(mainBlogElement, '[data-id="tag"]', mainBlog.tag);
  setTextContent(mainBlogElement, '[data-id="description"]', mainBlog.description2);

  const keepReadingElement = mainBlogElement.querySelector('[data-id="keepReading"]');
  if (keepReadingElement) {
    keepReadingElement.addEventListener('mousedown', () => {
      keepReadingElement.href = `../blog/blog-detail.html?id=${mainBlog.id}`;
    });
  }
}

function createBlog(blog) {
  if (!blog) return;

  const templateElement = document.getElementById('templateBlog');
  const liElement = templateElement.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  setImage(liElement, '[data-id="thumbnail"]', blog.thumbnail);
  setTextContent(liElement, '[data-id="national"]', blog.national);
  setTextContent(liElement, '[data-id="name"]', blog.name);
  setTextContent(liElement, '[data-id="tag"]', blog.tag);

  const blogLinkElement = liElement.querySelector('[data-id="blogLink"]');
  if (blogLinkElement) {
    blogLinkElement.addEventListener('mousedown', () => {
      blogLinkElement.href = `../blog/blog-detail.html?id=${blog.id}`;
    });
  }
  return liElement;
}

function renderBlogList(blogList) {
  if (!blogList || !Array.isArray(blogList)) return;
  //   remove the main blog
  const newBlogList = [...blogList];
  newBlogList.shift();

  const ulElement = document.getElementById('blogList');
  if (!ulElement) return;

  newBlogList.forEach((blog) => {
    const liElement = createBlog(blog);
    ulElement.appendChild(liElement);
  });
}

function createSideBar(length, blog, index) {
  if (!blog) return;

  const templateElement = document.getElementById('templateSidebar');
  const liElement = templateElement.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  setTextContent(liElement, '[data-id="name"]', blog.name);
  setTextContent(liElement, '[data-id="tag"]', blog.tag);
  const lineElement = liElement.querySelector('[data-id="line"]');
  if (lineElement && index < length - 1) {
    lineElement.classList.add('line');
  }

  const blogLinkElement = liElement.querySelector('[data-id="name"]');
  if (blogLinkElement) {
    blogLinkElement.addEventListener('mousedown', () => {
      blogLinkElement.href = `../blog/blog-detail.html?id=${blog.id}`;
    });
  }

  return liElement;
}

function renderSideBar(blogList) {
  if (!blogList || !Array.isArray(blogList)) return;
  //   remove the main blog
  const newBlogList = [...blogList];
  newBlogList.shift();

  const ulElement = document.getElementById('sideBarList');
  if (!ulElement) return;

  newBlogList.forEach((blog, indx) => {
    const liElement = createSideBar(newBlogList.length, blog, indx);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const blogList = await blogApi.getAll();

    renderMainBlog(blogList[0]);
    renderBlogList(blogList);
    renderSideBar(blogList);
  } catch (error) {
    console.log('get fail data blog');
  }
})();
