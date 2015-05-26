$(document).ready(function() {
  $(document).scroll(function(e) {
    if(getScrollTop() >= 40) {
      $('.main-nav').removeClass("stuck");
    } else {
      $('.main-nav').addClass("stuck");
    }
  });
})
