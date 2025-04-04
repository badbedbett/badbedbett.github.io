// src/view/task-component.js
import {createElement} from '../framework/render.js';

function createTaskComponentTemplate(task) {
  const { title, status } = task;
  return `
    <div class="taskboard__item task task--${status}">
    <li class="task-item">${title}</li>
    </div>
  `;
}




export default class TaskComponent {
  #element = null;
  #task = null;

  constructor({ task }) {
    this.#task = task;
  }

  getTemplate() {
    return createTaskComponentTemplate(this.#task);
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

