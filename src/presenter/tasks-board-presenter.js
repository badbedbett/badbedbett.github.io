import TasksListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import TaskBoardComponent from '../view/taskboard-component.js';
import DeleteButtonComponent from '../view/delete-btn-component.js';
import { render } from '../framework/render.js';
import { Status } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.getTasks()];
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach(status => {
      const tasksForStatus = this.#boardTasks.filter(task => task.status === status);
      this.#renderTaskList(tasksForStatus, status);
    });
  }

  #renderTaskList(tasks, status) {
    const taskListComponent = new TasksListComponent(status);
    render(taskListComponent, this.#tasksBoardComponent.getElement());

    tasks.forEach((task) => {
      const taskComponent = new TaskComponent({ task });
      render(taskComponent, taskListComponent.getElement());
    });

    if (status === Status.BASKET) {
      this.#renderDeleteButton(taskListComponent.getElement());
    }
  }

  #renderDeleteButton(container) {
    if (container.querySelector('.clear-btn')) {
      return;
    }
    const deleteButtonComponent = new DeleteButtonComponent();
    render(deleteButtonComponent, container);
  }
}