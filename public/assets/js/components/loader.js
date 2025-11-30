// Loading spinner overlay
export const Loader = {
  show(text = 'Loading...') {
    let overlay = document.getElementById('hs-loader');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hs-loader';
      overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50';
      overlay.innerHTML = `<div class="flex flex-col items-center gap-2"><div class="animate-spin h-8 w-8 border-4 border-white/40 border-t-white rounded-full"></div><p class="text-white text-sm">${text}</p></div>`;
      document.body.appendChild(overlay);
    }
  },
  hide() {
    const overlay = document.getElementById('hs-loader');
    if (overlay) overlay.remove();
  },
};