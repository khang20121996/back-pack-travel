export function handleNavMenu() {
  const shopLinkList = document.querySelectorAll('.shop__page');
  if (shopLinkList) {
    shopLinkList.forEach((shopLink) => {
      shopLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('/shop/shop.html');
      });

      shopLink.addEventListener('mousedown', (e) => {
        e.preventDefault();
        shopLink.href = './shop/shop.html';
      });
    });
  }

  //   const blogButton = navMenuElement.querySelector('[data-id="blog"]');
  //   if (blogButton) {
  //     blogButton.addEventListener('click', () => {
  //       //   window.location.assign('./blog/blog.html');
  //       console.log('click blog');
  //     });
  //   }
}
