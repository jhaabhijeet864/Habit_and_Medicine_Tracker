// Sets the site favicon/logo via JavaScript on all pages
// Uses a root-relative path so it works from nested routes
(function setFavicon() {
  const href = '/assets/images/icons/logo.png';
  const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];

  rels.forEach((rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
    if (rel.includes('icon')) link.type = 'image/png';
  });
})();