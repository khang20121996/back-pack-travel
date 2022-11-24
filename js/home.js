import {
  renderDestinationList,
  initBackToTopButton,
  handleNavHomeMenu,
  setImage,
  setTextContent,
} from './utils';
import { blogApi, travelApi } from './api/backPackTravelApi';

function createBlog(blog) {
  if (!blog) return;
  const templateElement = document.getElementById('templateBlog');
  if (!templateElement) return;

  const liElement = templateElement.content.firstElementChild.cloneNode(true);
  setImage(liElement, '[data-id="thumbnail"]', blog.thumbnail);
  setTextContent(liElement, '[data-id="name"]', blog.name);

  const linkBlog = liElement.querySelector('[data-id="linkPage"]');
  if (linkBlog) {
    linkBlog.addEventListener('mousedown', () => {
      linkBlog.href = `./blog/blog-detail.html?id=${blog.id}`;
    });
  }

  return liElement;
}

function renderBlogList(blogList) {
  if (!blogList || !Array.isArray(blogList)) return;
  const ulElement = document.getElementById('blogList');

  blogList.forEach((blog) => {
    if (blog.id > 3) {
      const liElement = createBlog(blog);
      ulElement.appendChild(liElement);
    }
  });
}

(async () => {
  // get Data from database
  // Render data to the UI
  try {
    // set queryparams by default (display 4 items)
    let queryparams = {
      _page: 1,
      _limit: 4,
    };

    // render destination list
    const { data, pagination } = await travelApi.getAll(queryparams);
    renderDestinationList(data);

    let destinationItems = queryparams._limit;
    // attach event for load more destination button
    const loadMoreButton = document.getElementById('loadMoreBtn');
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', async () => {
        console.log('click');
        queryparams = {
          _page: queryparams._page + 1,
          _limit: 4,
        };

        const { data, pagination } = await travelApi.getAll(queryparams);
        renderDestinationList(data);
        destinationItems += 4;
        if (destinationItems > pagination._totalRows) {
          loadMoreButton.style.display = 'none';
        }
      });
    }

    // render blog list
    const blogList = await blogApi.getAll();
    renderBlogList(blogList);

    // attach event back to top button
    const backToTopBtn = document.getElementById('backToTop');
    initBackToTopButton(backToTopBtn);

    // attach event navigation
    handleNavHomeMenu();
  } catch (error) {
    console.log('get all fail', error);
    // show modal..
  }
})();
