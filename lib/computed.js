/**
 * Module Dependencies
 */

var debug = require('debug')('css:computed');
var withinDocument = require('within-document');
var styles = require('./styles');
var camelcase = require('to-camel-case');
var hooks = require('./hooks');

/**
 * Expose `computed`
 */

module.exports = computed;

/**
 * Get the computed style
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Array} precomputed (optional)
 * @return {Array}
 * @api private
 */

function computed(el, prop, precomputed) {
  var computed = precomputed || styles(el);
  var ret;
  
  if (!computed) return;

  if (computed.getPropertyValue) {
    ret = computed.getPropertyValue(prop) || computed[prop];
  } else {
    ret = computed[prop];
  }

  if ('' === ret && !withinDocument(el)) {
    debug('element not within document, try finding from style attribute');
    ret = get(el, prop);
  }

  debug('computed value of %s: %s', prop, ret);

  // Support: IE
  // IE returns zIndex value as an integer.
  return undefined === ret ? ret : ret + '';
}

/**
 * Get the style
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} extra
 * @return {String}
 */

function get(el, prop, extra) {
  var style = el.style;
  var hook = hooks[prop] || hooks[orig];
  var orig = camelcase(prop);
  var ret;

  if (hook && hook.get && undefined !== (ret = hook.get(el, false, extra))) {
    debug('get hook defined, returning: %s', ret);
    return ret;
  }

  ret = style[prop];
  debug('getting %s', ret);
  return ret;
}
