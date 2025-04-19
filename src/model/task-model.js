import { tasks } from '../mock/task.js';
import { generateId } from '../utils.js';
import { Status } from '../const.js'; 

export default class TasksModel {
  #boardTasks = tasks;
  #observers = [];

  get tasks() {
    return [...this.#boardTasks];
  }


  addTask(title) {
    const newTask = {
      title,
      status: Status.BACKLOG,
      id: generateId(),
    };

    this.#boardTasks.push(newTask);
    this.#notifyObservers();
    return newTask;
  }
  getTasksByStatus(status) {
    return this.#boardTasks.filter(task => task.status === status);
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }


  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }


  deleteTasksByStatus(statusToDelete) {
    const initialLength = this.#boardTasks.length;
    this.#boardTasks = this.#boardTasks.filter(task => task.status !== statusToDelete);
    if (this.#boardTasks.length < initialLength) {
      this.#notifyObservers();
    }
  }
}