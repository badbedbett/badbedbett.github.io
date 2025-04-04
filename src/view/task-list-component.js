// src/view/task-list-component.js
import {createElement} from '../framework/render.js';
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

export default class TaskListComponent {

  constructor (status) {
    this.status = status;
  }

  getTemplate() {
    return createTaskListTemplate(this.status);
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
