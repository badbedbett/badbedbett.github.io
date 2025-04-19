import AbstractComponent from '../framework/view/abstract-component.js';

function createDeleteBtnComponentTemplate() {
  return (
    '<button type="submit" class="clear-btn" id="delete-button">Очистить</button>'
  );
}

export default class DeleteButtonComponent extends AbstractComponent {
  get template() {
    return createDeleteBtnComponentTemplate();
  }
}