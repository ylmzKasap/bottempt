function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

function cartProd(paramArray) {
 
  function addTo(curr, args) {
    
    var i, copy, 
        rest = args.slice(1),
        last = !rest.length,
        result = [];
    
    for (i = 0; i < args[0].length; i++) {
      
      copy = curr.slice();
      copy.push(args[0][i]);
      
      if (last) {
        result.push(copy);
      
      } else {
        result = result.concat(addTo(copy, rest));
      }
    }
    
    return result;
  }

  return addTo([], Array.prototype.slice.call(arguments));
}

module.exports = {
    arraysEqual, cartProd
}