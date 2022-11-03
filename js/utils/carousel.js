$(document).ready(function () {
  $('.owl-carousel').owlCarousel();
});

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';

const webpack = require('webpack');

//...
plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  }),
];
//...
