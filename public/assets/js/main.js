// Active navigation link highlighter
// Adds active styles to the navbar based on current path
(() => {
  const currentPath = window.location.pathname.replace(/\\/g, '/');

  // Find all nav anchors
  const navAnchors = document.querySelectorAll('nav a[href]');
  if (!navAnchors.length) return;

  const normalize = (href) => {
    try {
      const url = new URL(href, window.location.origin);
      return url.pathname.replace(/\\/g, '/');
    } catch {
      return href;
    }
  };

  navAnchors.forEach((a) => {
    const path = normalize(a.getAttribute('href'));
    const isActive = currentPath.endsWith(path) || currentPath === path;
    a.classList.remove('text-gray-600', 'hover:text-gray-900', 'font-medium');
    a.classList.remove('text-blue-600', 'font-semibold', 'border-b-2', 'border-blue-600', 'pb-1');

    // Base style
    a.classList.add('font-medium');

    if (isActive) {
      a.classList.add('text-blue-600', 'font-semibold', 'border-b-2', 'border-blue-600', 'pb-1');
    } else {
      a.classList.add('text-gray-600');
      a.classList.add('hover:text-gray-900');
    }
  });
})();