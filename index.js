
module.exports = function(el, obj){
  for (var key in obj) {
    var val = obj[key];
    if ('number' == typeof val) val += 'px';
    el.style[key] = val;
  }
};
