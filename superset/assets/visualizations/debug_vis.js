const $ = require('jquery');

require('./debug_vis.css');

function debug_vis(slice, payload) {
  $('#code').attr('rows', '15');
  slice.container.html(payload.data.foo);
  // console.log(payload.data.foo);
}

module.exports = debug_vis;
