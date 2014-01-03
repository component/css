/**
 * Module Dependencies
 */

var withinDocument = require('within-document');
var styles = require('./styles');

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
  computed = precomputed || styles(el);
  if (!computed) return;

  var style = require('./style');
  var ret = computed.getPropertyValue(prop) || computed[prop];

  if ('' === ret && !withinDocument(el)) {
    ret = style(el, prop);
  }

  // Support: IE
  // IE returns zIndex value as an integer.
  return undefined === ret ? ret : ret + '';
}
