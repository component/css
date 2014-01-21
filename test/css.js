/**
 * Module Dependencies
 */

var assert = require('assert');
var css = require('css');
var domify = require('domify');
var each = require('each');
var stylesheet = require('load-styles');

/**
 * Run tests
 */

describe('css(prop)', function() {
  var el = domify('<div id="test-container"></div>');
  document.body.appendChild(el);

  beforeEach(function() {
    el.textContent = '';
  });

  it ('should be compatible with old component/css', function() {
    var el = { style: {} };
    css(el, {
      display: 'block',
      top: 5,
      left: 5,
      width: 1,
      height: 1,
      opacity: 1,
      lineHeight: 1.5,
      zIndex: 10
    });

    assert('block' == el.style.display)
    assert('5px' == el.style.top)
    assert('5px' == el.style.left)
    assert('1px' == el.style.width)
    assert('1px' == el.style.height)
    assert('1' == el.style.opacity)
    assert('1.5' == el.style.lineHeight)
    assert('10' == el.style.zIndex)
    assert(el == css(el, {}))
  });

  it ('width & height should be 0px on disconnected nodes', function() {
    var div = domify('<div></div>');
    assert('0px' == css(div, 'width'));
    assert('0px' == css(div, 'height'));
  });

  it ('should be able to height & width on disconnected nodes', function() {
    var div = domify('<div></div>');
    css(div, { width: 4, height: 4 });
    assert('4px' == css(div, 'width'));
    assert('4px' == css(div, 'height'));
  });

  it ('should be able to get height on hidden elements', function() {
    var div = domify( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'></textarea><div style='height:20px;'></div></div>");
    el.appendChild(div);
    assert('20px' == css(div.querySelector('input'), 'height'), 'height on hidden input');
    assert('20px' == css(div.querySelector('textarea'), 'height'), 'height on hidden textarea');
    assert('20px' == css(div.querySelector('div'), 'height'), 'height on hidden div');
    el.removeChild(div);
  });

  it('should handle negative numbers by setting to zero', function() {
    var div = domify('<div></div>');
    el.appendChild(div);
    css(div, { width: 1, height: 1 });
    assert('1px' == css(div, 'height'));
    assert('1px' == css(div, 'width'));
    css(div, { width: -1, height: -1 });
    assert('0px' == css(div, 'height'));
    assert('0px' == css(div, 'width'));
    el.removeChild(div);
  });

  it('should have style on disconnected nodes', function() {
    var div = domify("<div style='display: none;'/>");
    el.appendChild(div);
    assert('none' == css(div, 'display'));
    el.removeChild(div);
  });

  it('should get the modified float', function() {
    var div = domify('<div>');
    el.appendChild(div);
    css(div, 'float', 'right');
    assert('right' == css(div, 'float'), 'Modified CSS float using \"float\": Assert float is right');
    el.removeChild(div);
  });

  it('should handle modified font-size', function() {
    var span = domify('<span style="float: right">');
    el.appendChild(span);
    css(span, 'font-size', '30px');
    assert('right' == css(span, 'float'), 'Modified CSS float using \"float\": Assert float is right');
    assert('30px' == css(span, 'font-size'), 'Modified CSS font-size: Assert font-size is 30px');
    el.removeChild(span);
  });

  describe('opacity', function() {
    var div;

    beforeEach(function() {
      div = domify('<div>');
      el.appendChild(div);
    });

    afterEach(function() {
      el.removeChild(div);
    });

    it('should handle changes in opacity', function() {
      each([ "0", "0.25", "0.5", "0.75", "1" ], function(opacity) {
        css(div, 'opacity', opacity);
        assert(parseFloat(opacity) == css(div, 'opacity'), 'opacity can be a string');
        opacity = parseFloat(opacity);
        css(div, 'opacity', opacity);
        assert(opacity == css(div, 'opacity'), 'opacity can be a number');
      });
    });

    it('empty opacity should be 1', function() {
      css(div, 'opacity', '');
      assert('1' == css(div, 'opacity'));
    });

    it('opacity in IE', function() {
      var ol = domify('<ol style="opacity: 0">');
      assert(0 == css(ol, 'opacity'), 'opacity is accessible via filter property set in stylesheet in IE');
      css(ol, { opacity: '1' })
      assert(1 == css(ol, 'opacity'), 'opacity is taken from style attribute when set vs stylesheet in IE with filters');
    });
  });

  describe('css cascading', function() {
    var div;
    var child;
    var style;

    var styles = [];
    styles.push('#font-size { font-size: 16px; }')
    styles.push('#font-size .em { font-size: 2em; }')
    styles.push('#font-size .prct { font-size: 150%; }')
    styles = styles.join('\n');

    beforeEach(function() {
      div = domify('<div id="font-size"><div></div></div>');
      child = div.querySelector('div');
      style = stylesheet(styles);
      el.appendChild(div);
    });

    afterEach(function() {
      child.removeAttribute('class');
      el.removeChild(div);
      style.parentNode.removeChild(style);
    });


    // TODO: use Nathan's stylesheet module
    it('should get font-size for div', function() {
      assert(16 == parseInt(css(div, 'fontSize'), 10));
      assert(16 == parseInt(css(div, 'font-size'), 10));
    });

    it('should cascade to the child node', function() {
      assert(16 == parseInt(css(child, 'fontSize'), 10));
      assert(16 == parseInt(css(child, 'font-size'), 10));
    });

    it('should set height correctly', function() {
      css(child, 'height', '100%');
      assert('100%' == child.style.height);
    });

    it('should set em correctly', function() {
      child.setAttribute('class', 'em');
      assert(32 == parseInt(css(child, 'fontSize'), 10), 'verify font-size em is set');
    });

    it('should set percentages correctly', function() {
      child.setAttribute('class', 'prct');
      var val = parseInt(css(child, 'fontSize'), 10);
      var checkval;
      if (16 == val || 24 == val) checkval = val;
      assert(checkval == val, 'verify font-size % is set');
      assert('string' == typeof css(child, 'width'), 'make sure a string is returned from width');
    });
  });

  it('shouldn\'t change an attribute on NaN', function() {
    var div = domify('<div style="height: 36px">');
    el.appendChild(div);
    css(div, 'height', parseFloat('nan'));
    assert('36px' == div.style.height);
    el.removeChild(div);
  });

  it('shouldn\'t change with null', function() {
    var div = domify('<div style="height: 36px">');
    el.appendChild(div);
    css(div, 'height', null);
    assert('36px' == div.style.height);
    el.removeChild(div);
  });

  it('should return undefined with fake properties', function() {
    var div = domify('<div>');
    el.appendChild(div);
    assert(undefined == css(div, 'fake'));
    el.removeChild(div);
  });

  it('should return z-index properly (#14432)', function() {
    var div = domify('<div>');
    css(div, { position: 'absolute', 'z-index': 1000 });
    el.appendChild(div);
    assert('1000' == css(div, 'z-index'));
    el.removeChild(div);
  });
});
