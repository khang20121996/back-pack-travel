// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        destinationDetail: resolve(__dirname, 'destination-detail.html'),
        shop: resolve(__dirname, 'shop/shop.html'),
        productDetail: resolve(__dirname, 'shop/product-detail.html'),
        blog: resolve(__dirname, 'blog/blog.html'),
        blogDetail: resolve(__dirname, 'blog/blog-detail.html'),
      },
    },
  },
});
