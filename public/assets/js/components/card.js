// Simple reusable card component factory
export function createCard({ title, content, footer }) {
  const card = document.createElement('div');
  card.className = 'rounded-lg border bg-white shadow-sm';
  card.innerHTML = `
    <div class="p-4 border-b"><h3 class="font-semibold text-gray-800">${title || ''}</h3></div>
    <div class="p-4 text-gray-700">${content || ''}</div>
    ${footer ? `<div class="p-3 border-t text-sm text-gray-500">${footer}</div>` : ''}
  `;
  return card;
}