import TasksListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import TaskBoardComponent from '../view/taskboard-component.js';
import NoTasksComponent from '../view/no-tasks-component.js';
import LoadingViewComponent from '../view/loading-view-component.js';
import { render, remove } from '../framework/render.js';
import { Status, UpdateType, UserAction } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #loadingComponent = new LoadingViewComponent();
  #isLoading = true;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelEvent);
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  async init() {
    render(this.#loadingComponent, this.#boardContainer);

    try {
      await this.#tasksModel.init();
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    } finally {
      this.#isLoading = false;
      remove(this.#loadingComponent);
      this.#clearBoard();
      this.#renderBoard();
    }
  }

  async createTask() {
    const taskTitleInput = document.querySelector('#add-task');
    if (!taskTitleInput) {
      console.error('Поле ввода #add-task не найдено.');
      return;
    }
    const taskTitle = taskTitleInput.value.trim();
    if (!taskTitle) {
      return;
    }
    try {
      await this.#tasksModel.addTask(taskTitle);
      taskTitleInput.value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }

  async #handleTaskDrop(taskId, newStatus) {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  }

  async #handleClearBasketClick() {
    try {
      await this.#tasksModel.clearBasketTasks();
    } catch (err) {
      console.error('Ошибка при очистке корзины:', err);
    }
  }

  #renderBoard() {
    if (!this.#boardContainer.contains(this.#tasksBoardComponent.element)) {
      render(this.#tasksBoardComponent, this.#boardContainer);
    }

    const currentTasks = this.tasks;
    Object.values(Status).forEach((status) => {
      let hasTasks = false;
      if (status === Status.BASKET) {
        hasTasks = this.#tasksModel.hasBasketTasks();
      }
      const tasksListComponent = new TasksListComponent({
        status: status,
        onTaskDrop: this.#handleTaskDrop.bind(this),
        onClearBasketClick: this.#handleClearBasketClick.bind(this),
        hasTasksInBasket: hasTasks
      });

      render(tasksListComponent, this.#tasksBoardComponent.element);

      const tasksForStatus = currentTasks.filter(task => task.status === status);
      const listElement = tasksListComponent.element.querySelector('.task-list');

      if (!listElement) {
        console.error(`Элемент '.task-list' не найден для статуса '${status}'`);
        return;
      }

      if (tasksForStatus.length === 0) {
        this.#renderNoTasks(listElement);
      } else {
        tasksForStatus.forEach((task) => {
          this.#renderTask(task, listElement);
        });
      }
    });
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderNoTasks(container) {
    const noTasksComponent = new NoTasksComponent();
    render(noTasksComponent, container);
  }

  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#clearBoard();
        this.#renderBoard();
        break;
      default:
    }
  };
}