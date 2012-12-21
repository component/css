
var assert = require('assert');
var css = require('./');

var el = {
  style: {}
};

css(el, {
  display: 'block',
  top: 5,
  left: 5,
  width: 1,
  height: 1
})

assert('block' == el.style.display)
assert('5px' == el.style.top)
assert('5px' == el.style.left)
assert('1px' == el.style.width)
assert('1px' == el.style.height)
