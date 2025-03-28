// src/view/task-list-component.js
import {createElement} from '../framework/render.js';

function createTaskListComponentTemplate(title) {
  return (
    `<div class="column">
      <h2>${title}</h2>
    </div>`
  );
}

export default class TaskListComponent {
  constructor(title) {
    this.title = title;
  }

  getTemplate() {
    return createTaskListComponentTemplate(this.title);
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