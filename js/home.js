import travelApi from './api/backPackTravelApi';
import { renderDestinationList, initBackToTopButton } from './utils';

(async () => {
  // get Data from database
  // Render data to the UI
  try {
    // set queryparams by default (display 4 items)
    let queryparams = {
      _page: 1,
      _limit: 4,
    };
    const { data, pagination } = await travelApi.getAll(queryparams);
    renderDestinationList(data);

    let destinationItems = queryparams._limit;

    // attach event for load more button
    const loadMoreButton = document.getElementById('loadMoreBtn');
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', async () => {
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

    // attach event back to top button
    const backToTopBtn = document.getElementById('backToTop');
    initBackToTopButton(backToTopBtn);
  } catch (error) {
    console.log('get all fail', error);
    // show modal..
  }
})();