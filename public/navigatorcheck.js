navigatorCheck();

function navigatorCheck() {

// Test if IE
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  var trident = ua.indexOf('Trident');

  if (msie > 0 || trident > 0) {
    // If Internet Explorer, return version number
    var element = document.getElementById('noie');
    element.style.display = 'block'; //or

    element = document.getElementById('splash');
    element.style.display = 'none'; //or
    element.style.visibility = 'hidden';
  }
}
