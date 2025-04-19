import AbstractComponent from '../framework/view/abstract-component.js';

function createTaskboardComponentTemplate() {
  return (
    `<div class="task-columns">`
  );
}

export default class TaskboardComponent extends AbstractComponent {
  get template() {
    return createTaskboardComponentTemplate();
  }
}