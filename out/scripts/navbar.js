$(document).ready(function() {
  $(document).scroll(function(e) {
    if(getScrollTop() >= 90) {
      $('.main-nav').removeClass("stuck");
    } else {
      $('.main-nav').addClass("stuck");
    }
  });
})
