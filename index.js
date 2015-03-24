// If Javascript is disabled, we don't want to make the page invisible.
$(document.head).append("<style>#main{opacity:0;}#loadingIndicator{display:block;}</style>");

// Fade the page in when everything has loaded. This prevents FOUC, especially noticable with custom fonts.
$(window).load(function() {
  $("#loadingIndicator").remove();
  $("#main").addClass("loaded");
  var navHideDistance = 70;
  var navMouseOver = false;
  
  $(document).scroll(function(e) {
    if(document.body.scrollTop >= navHideDistance && !navMouseOver) {
      showTitle(false);
    } else {
      showTitle(true);
    }
  });
  
  $(".mainNav").on('mouseenter click', function() {
    navMouseOver = true;
    if(document.body.scrollTop >= navHideDistance) {
      showTitle(true);
    }
  }).on('mouseleave', function(e) {
    navMouseOver = false;
    if(document.body.scrollTop >= navHideDistance) {
      showTitle(false);
    }
  })
  
  function showTitle(show) {
    var mn = $(".mainNav")
    if(show) {
      if(mn.hasClass("mainNavCondensed")) {
        mn.removeClass("mainNavCondensed");
        setTimeout(function() {
          if(!mn.hasClass("mainNavCondensed")) {
            mn.css({
              "overflow": "visible"
            });
          }
        }, 500);
      }
    } else {
      if(!mn.hasClass("mainNavCondensed")) {
        mn.addClass("mainNavCondensed");
        mn.css({
          "overflow": "hidden"
        });
      }
    }
  }
});
