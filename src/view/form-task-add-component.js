import AbstractComponent from '../framework/view/abstract-component.js';

function createFormAddTaskComponentTemplate() {
  return (
    `<form class="add-task__form" aria-label="Форма добавления задачи">
      <div class="add-task__input-wrapper">
        <label for="add-task">Новая задача</label>
        <input type="text" name="task-name" id="add-task" placeholder="Название задачи..." required>
      </div>
      <button class="add-task__button button" type="submit">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10.0833" y="3.66663" width="1.83333" height="14.6667" fill="white" />
          <rect x="18.3333" y="10.0833" width="1.83333" height="14.6667" transform="rotate(90 18.3333 10.0833)" fill="white" />
        </svg>
        <span>Добавить</span>
      </button>
    </form>`
  );
}

export default class FormAddTaskComponent extends AbstractComponent {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('submit', this.#submitHandler);
  }

  get template() {
    return createFormAddTaskComponentTemplate();
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    const inputField = this.element.querySelector('#add-task');
    const taskTitle = inputField.value.trim();
    if (!taskTitle) {
      console.warn('Task title cannot be empty');
      return;
    }
    this.#handleClick(taskTitle);
  };
}