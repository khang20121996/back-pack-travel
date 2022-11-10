export function handleNavMenu(parent) {
  const navMenuElement = document.getElementById(parent);
  if (!navMenuElement) return;

  const shopButton = navMenuElement.querySelector('[data-name="shop"]');
  if (shopButton) {
    shopButton.addEventListener('click', () => {
      window.location.assign('./shop/shop.html');
    });
  }
}
