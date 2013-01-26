var cssNumber = {
  "columnCount": true,
  "fillOpacity": true,
  "fontWeight": true,
  "lineHeight": true,
  "opacity": true,
  "orphans": true,
  "widows": true,
  "zIndex": true,
  "zoom": true
};

module.exports = function(el, obj){
  for (var key in obj) {
    var val = obj[key];
    if ('number' == typeof val && !cssNumber[key]) val += 'px';
    el.style[key] = val;
  }
};
