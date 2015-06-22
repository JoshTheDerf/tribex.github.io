// Replaces the relative URLs in share buttons with absolute ones.
$(document).ready(function() {
  $('.sharebtn').each(function() {
    $(this).attr("href", $(this).attr("href").split("--[LOCATION]--").join(encodeURIComponent(window.location)));
  });
});
