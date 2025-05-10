import AbstractComponent from '../framework/view/abstract-component.js';
import { StatusLabel } from '../const.js';
import DeleteButtonComponent from './delete-btn-component.js'; // Импортируем компонент кнопки

function createTaskListTemplate(status, hasTasksInBasket) {
  const statusLabel = StatusLabel[status] || status;
  return (
    `<section class="column ${status}" data-status="${status}">
      <h2 class="task-title">${statusLabel}</h2>
      <ul class="task-list"></ul>
      ${status === 'basket' && hasTasksInBasket ? '<div class="delete-button-container"></div>' : ''}
    </section>`
  );
}

export default class TaskListComponent extends AbstractComponent {
  #status = null;
  #handleTaskDrop = null;
  #handleClearBasketClick = null;
  #hasTasksInBasket = false; // Добавляем свойство для хранения информации о наличии задач

  constructor({ status, onTaskDrop, onClearBasketClick, hasTasksInBasket }) { // Добавляем hasTasksInBasket
    super();
    this.#status = status;
    this.#handleTaskDrop = onTaskDrop;
    this.#handleClearBasketClick = onClearBasketClick;
    this.#hasTasksInBasket = hasTasksInBasket; // Сохраняем информацию о наличии задач
    this.#addDragDropHandlers();

    if (status === 'basket' && this.#hasTasksInBasket) { // Проверяем наличие задач
      this.#renderDeleteButton();
    }
  }

  get template() {
    return createTaskListTemplate(this.#status, this.#hasTasksInBasket); // Передаем информацию в шаблон
  }

  #addDragDropHandlers() {
    const element = this.element;
    element.addEventListener('dragover', this.#handleDragOver);
    element.addEventListener('drop', this.#handleDrop);
  }

  #handleDragOver = (event) => {
    event.preventDefault();
  };

  #handleDrop = (event) => {
    event.preventDefault();
    const draggedTaskId = event.dataTransfer.getData('text/plain');

    const targetTaskElement = event.target.closest('li.task');

    const targetTaskId = targetTaskElement ? targetTaskElement.dataset.taskId : null;

    if (draggedTaskId === targetTaskId) {
      console.log(`Task ${draggedTaskId} dropped onto itself. Ignoring.`);
      return;
    }

    if (draggedTaskId && typeof this.#handleTaskDrop === 'function') {
      this.#handleTaskDrop(draggedTaskId, this.#status, targetTaskId);
      console.log(`Task ${draggedTaskId} dropped onto status ${this.#status}. Target task: ${targetTaskId}`);
    } else {
      console.warn('Drop event occurred, but taskId or drop handler is missing.');
    }
  };

  #renderDeleteButton() {
    const deleteButtonContainer = this.element.querySelector('.delete-button-container');
    if (deleteButtonContainer) {
      const deleteButtonComponent = new DeleteButtonComponent({
        onClick: this.#handleClearBasketClick,
        isDisabled: false,
      });
      deleteButtonContainer.appendChild(deleteButtonComponent.element);
    }
  }
}