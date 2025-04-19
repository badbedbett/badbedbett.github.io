import TasksListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import TaskBoardComponent from '../view/taskboard-component.js';
import DeleteButtonComponent from '../view/delete-btn-component.js';
import NoTasksComponent from '../view/no-tasks-component.js';
import { render, remove } from '../framework/render.js';
import { Status } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #boardTasks = [];
  #noTasksComponent = new NoTasksComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
  }

  #renderTasksList(tasks, status, container) {
    const taskListComponent = new TasksListComponent(status);
    render(taskListComponent, container);

    if (tasks.length === 0) {
      this.#renderNoTasks(taskListComponent.element);
    } else {
      tasks.forEach((task) => {
        this.#renderTask(task, taskListComponent.element);
      });
    }

    if (status === Status.BASKET) {
      this.#renderDeleteButtonComponent(taskListComponent.element);
    }
  }

  #renderDeleteButtonComponent(container) {
    if (container.querySelector('.clear-btn')) {
      return;
    }
    const deleteButtonComponent = new DeleteButtonComponent();
    render(deleteButtonComponent, container);
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderNoTasks(container) {
    render(this.#noTasksComponent, container);
  }

  #clearBoard() {
    Object.values(Status).forEach((status) => {
      remove(new TasksListComponent(status));
    });
    remove(this.#noTasksComponent);
  }

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    if (this.#boardTasks.length === 0) {
      this.#renderNoTasks(this.#boardContainer);
      return;
    }

    Object.values(Status).forEach((status) => {
      const tasksForStatus = this.#boardTasks.filter(task => task.status === status);
      this.#renderTasksList(tasksForStatus, status, this.#tasksBoardComponent.element);
    });
  }
}