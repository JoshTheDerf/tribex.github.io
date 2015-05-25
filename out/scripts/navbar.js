window.getScrollTop = function() {
  return (document.documentElement.scrollTop ||
    document.body.parentNode.scrollTop ||
    document.body.scrollTop);
}

$(document).ready(function() {
  $(document).scroll(function(e) {
    if(getScrollTop() >= 90) {
      $('.main-nav').removeClass("stuck");
    } else {
      $('.main-nav').addClass("stuck");
    }
  });
})
