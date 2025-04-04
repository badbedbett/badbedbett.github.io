import {createElement} from '../framework/render.js'; 

function createDeleteBtnComponentTemplate() {
    return (
        '<button type="submit" class="clear-btn" id="delete-button"> Очистить</button>'
      );
}

export default class DeleteButtonComponent {
  getTemplate() {
    return createDeleteBtnComponentTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}