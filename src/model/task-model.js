import Observable from '../framework/observable.js';
import { UpdateType, UserAction, Status } from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardtasks = [];

  constructor({tasksApiService}) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return [...this.#boardtasks];
  }

  async init() {
    try {
      const tasksFromServer = await this.#tasksApiService.tasks;
      this.#boardtasks = tasksFromServer.map(this.#adaptToClient);
    } catch(err) {
      this.#boardtasks = [];
    }
    this._notify(UpdateType.INIT);
  }

  #adaptToClient(task) {
    const adaptedTask = {...task};
    if (typeof task.status === 'string' && Status[task.status.toUpperCase()]) {
        adaptedTask.status = Status[task.status.toUpperCase()];
    }
    return adaptedTask;
  }

  async addTask(title) {
    const newTaskPayload = {
      title,
      status: Status.BACKLOG,
    };
    try {
      const taskFromServer = await this.#tasksApiService.addTask(newTaskPayload);
      const adaptedTask = this.#adaptToClient(taskFromServer);
      this.#boardtasks.push(adaptedTask);
      this._notify(UserAction.ADD_TASK, adaptedTask);
      return adaptedTask;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskStatus(taskId, newStatus) {
    const task = this.#boardtasks.find((task) => task.id === taskId);
    if (!task) {
      return;
    }
    const previousStatus = task.status;
    task.status = newStatus;

    try {
      const updatedTaskFromServer = await this.#tasksApiService.updateTask(task);
      const adaptedTask = this.#adaptToClient(updatedTaskFromServer);

      const index = this.#boardtasks.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        this.#boardtasks[index] = adaptedTask;
      }

      this._notify(UserAction.UPDATE_TASK, adaptedTask);
      return adaptedTask;
    } catch (err) {
      task.status = previousStatus;
      throw err;
    }
  }

  async moveTask(draggedTaskId, newStatus, targetTaskId) {
    try {
      await this.updateTaskStatus(draggedTaskId, newStatus);
    } catch (err) {
      throw err;
    }
  }

  getTasksByStatus(status) {
    return this.#boardtasks.filter(task => task.status === status);
  }

  deleteTask(taskId) {
    this.#boardtasks = this.#boardtasks.filter((task) => task.id !== taskId);
    this._notify(UserAction.DELETE_TASK, { id: taskId });
  }

  async clearBasketTasks() {
    const basketTasks = this.#boardtasks.filter((task) => task.status === Status.BASKET);
    try {
      for (const task of basketTasks) {
        await this.#tasksApiService.deleteTask(task.id);
        this.deleteTask(task.id);
      }
      this._notify(UserAction.DELETE_TASK, { status: Status.BASKET });
    } catch (err) {
      console.error('Ошибка при удалении задач из корзины:', err);
      throw err;
    }
  }

  hasBasketTasks() {
    return this.#boardtasks.some((task) => task.status === Status.BASKET);
  }
}