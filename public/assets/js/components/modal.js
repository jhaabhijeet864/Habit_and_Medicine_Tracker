// Reusable modal component
export class Modal {
  constructor(root) {
    this.root = root;
    this.closeBtn = root?.querySelector('[data-modal-close]');
    this.overlay = root?.querySelector('[data-modal-overlay]');
    this.bind();
  }
  bind() {
    [this.closeBtn, this.overlay].forEach((el) => el && el.addEventListener('click', () => this.hide()));
  }
  show() { this.root?.classList.remove('hidden'); }
  hide() { this.root?.classList.add('hidden'); }
}