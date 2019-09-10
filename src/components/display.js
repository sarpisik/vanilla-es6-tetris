export default class Display {
  constructor(selector) {
    this.element = document.querySelector(selector);
  }

  updateContent = content => (this.element.innerText = content);
}
