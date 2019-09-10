export default class Button {
  constructor(selector, eventHandler) {
    this.element = document.querySelector(selector);
    this.element.addEventListener('click', eventHandler);
  }

  updateContent = content => (this.element.innerText = content);
}
