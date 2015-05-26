window.getScrollTop = function() {
  return (document.documentElement.scrollTop ||
    document.body.parentNode.scrollTop ||
    document.body.scrollTop);
}
