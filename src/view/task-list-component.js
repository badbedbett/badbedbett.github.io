import AbstractComponent from '../framework/view/abstract-component.js';
import { StatusLabel } from '../const.js';

function createTaskListTemplate(status) {
  const statusLabel = StatusLabel[status];
  return (
    `<section class="taskboard__list ${status}">
      <h2 class="task-title ${status}">${statusLabel}</h2>
      <ul class="task-list"></ul>
    </section>`
  );
}

export default class TaskListComponent extends AbstractComponent {
  #status = null;

  constructor(status) {
    super();
    this.#status = status;
  }

  get template() {
    return createTaskListTemplate(this.#status);
  }
}