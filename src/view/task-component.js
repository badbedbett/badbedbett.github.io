import AbstractComponent from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {
  const { title, status } = task;
  return `
    <li class="task task--${status}" data-task-id="${task.id}">
      ${title}
    </li>
  `;
}

export default class TaskComponent extends AbstractComponent {
  #task = null;

  constructor({ task }) {
    super();
    this.#task = task;
    this.#addDragHandlers();
  }

  get template() {
    return createTaskComponentTemplate(this.#task);
  }

  #addDragHandlers() {
    const element = this.element;
    element.setAttribute('draggable', true);
    element.addEventListener('dragstart', this.#handleDragStart);
  }

  #handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', this.#task.id);
    console.log(`Dragging started for task ID: ${this.#task.id}`);
  };
}