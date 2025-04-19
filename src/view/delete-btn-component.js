import AbstractComponent from '../framework/view/abstract-component.js';

function createDeleteBtnComponentTemplate(isDisabled) {
  return (
    `<button
      type="button" // Лучше использовать type="button" если кнопка не отправляет форму
      class="clear-btn"
      id="delete-button"
      ${isDisabled ? 'disabled' : ''} // Добавляем атрибут disabled, если флаг true
    >
      Очистить
    </button>`
  );
}

export default class DeleteButtonComponent extends AbstractComponent {
  #handleClick = null;
  #isDisabled = false;

  constructor({ onClick, isDisabled }) {
    super();
    this.#handleClick = onClick;
    this.#isDisabled = isDisabled;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createDeleteBtnComponentTemplate(this.#isDisabled);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}