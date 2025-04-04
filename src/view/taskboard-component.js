import {createElement} from '../framework/render.js';
import { StatusLabel } from '../const.js';

function createTaskboardComponentTemplate() {
  return (
    `<div class="task-columns">`
  );
}

export default class TaskboardComponent {
  getTemplate() {
    return createTaskboardComponentTemplate();
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