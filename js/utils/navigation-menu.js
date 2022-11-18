export function handleNavMenu() {
  const shopButton = document.getElementById('shop');
  if (shopButton) {
    shopButton.addEventListener('click', (e) => {
      //   window.location.assign('./shop/shop.html');
      console.log('click shop');
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
