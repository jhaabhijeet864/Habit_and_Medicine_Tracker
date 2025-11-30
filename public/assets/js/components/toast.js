// Simple toast notifications
export function showToast(message, { type = 'info', duration = 2500 } = {}) {
  const containerId = 'hs-toast-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const base = 'px-4 py-2 rounded shadow text-sm';
  const styles = {
    info: `${base} bg-blue-600 text-white`,
    success: `${base} bg-green-600 text-white`,
    warning: `${base} bg-yellow-500 text-white`,
    error: `${base} bg-red-600 text-white`,
  };
  toast.className = styles[type] || styles.info;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}