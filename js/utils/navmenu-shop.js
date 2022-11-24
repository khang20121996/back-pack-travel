export function handleNavShopMenu() {
  const homeLinkList = document.querySelectorAll('.home__page');
  if (homeLinkList) {
    homeLinkList.forEach((homeLink) => {
      homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('../index.html');
      });

      homeLink.addEventListener('mousedown', (e) => {
        e.preventDefault();
        homeLink.href = '../index.html';
      });
    });
  }

  const shopLinkList = document.querySelectorAll('.shop__page');
  if (shopLinkList) {
    shopLinkList.forEach((shopLink) => {
      shopLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('shop.html');
      });

      shopLink.addEventListener('mousedown', (e) => {
        e.preventDefault();
        shopLink.href = 'shop.html';
      });
    });
  }

  const blogLinkList = document.querySelectorAll('.blog__page');
  if (blogLinkList) {
    blogLinkList.forEach((blogLink) => {
      blogLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('../blog/blog.html');
      });

      blogLink.addEventListener('mousedown', (e) => {
        e.preventDefault();
        blogLink.href = '../blog/blog.html';
      });
    });
  }
}
