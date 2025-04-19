import AbstractComponent from '../framework/view/abstract-component.js';

function createNoTasksTemplate() {
  return `<p class="board__no-tasks">
              Здесь пока нет задач.
            </p>`;
}

export default class NoTasksComponent extends AbstractComponent {
  get template() {
    return createNoTasksTemplate();
  }
}