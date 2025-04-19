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
  #noTasksComponent = new NoTasksComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  init() {
    this.#renderBoard();
  }

  createTask(title) {
    if (!title) {
      console.warn('Task title cannot be empty when calling createTask');
      return;
    }
    this.#tasksModel.addTask(title);
  }

  #handleClearBasketClick = () => {
    this.#tasksModel.deleteTasksByStatus(Status.BASKET);
  };

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
      this.#renderDeleteButtonComponent(taskListComponent.element, tasks.length > 0);
    }
  }

  #renderDeleteButtonComponent(container, hasTasks) {
    const deleteButtonComponent = new DeleteButtonComponent({
      onClick: this.#handleClearBasketClick,
      isDisabled: !hasTasks
    });
    render(deleteButtonComponent, container);
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderNoTasks(container) {
    render(new NoTasksComponent(), container);
  }

  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }

  #handleModelChange() {
    this.#clearBoard();
    this.#renderBoard();
  }
  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach((status) => {
      const tasksForStatus = this.#tasksModel.getTasksByStatus(status);
      this.#renderTasksList(tasksForStatus, status, this.#tasksBoardComponent.element);
    });
  }
}