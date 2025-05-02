import { tasks } from '../mock/task.js';
import { generateId } from '../utils.js';
import { Status } from '../const.js';

export default class TasksModel {
  #boardTasks = tasks;
  #observers = new Set();

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

  moveTask(draggedTaskId, newStatus, targetTaskId) {
    const draggedTaskIndex = this.#boardTasks.findIndex(task => task.id === draggedTaskId);
    if (draggedTaskIndex === -1) {
      console.warn(`[Model] Dragged task ${draggedTaskId} not found.`);
      return;
    }
    const draggedTask = this.#boardTasks[draggedTaskIndex];
    const isSamePosition =
      draggedTask.status === newStatus &&
      (
        (targetTaskId === null && this.#boardTasks[draggedTaskIndex + 1]?.status !== newStatus) ||
        (targetTaskId !== null && this.#boardTasks[draggedTaskIndex + 1]?.id === targetTaskId)
      );

    if (draggedTask.status === newStatus && targetTaskId === null && this.#boardTasks.filter(t => t.status === newStatus).at(-1)?.id === draggedTaskId) {
       console.log(`[Model] Task ${draggedTaskId} dropped into the same list at the end. No change needed.`);
    }
    if (draggedTask.status === newStatus && targetTaskId === this.#boardTasks[draggedTaskIndex + 1]?.id) {
        console.log(`[Model] Task ${draggedTaskId} dropped before the next element in the same list. No change needed.`);
    }

    draggedTask.status = newStatus;

    this.#boardTasks.splice(draggedTaskIndex, 1);

    let insertionIndex;

    if (targetTaskId === null) {
      let lastIndexOfSameStatus = -1;
      for (let i = this.#boardTasks.length - 1; i >= 0; i--) {
        if (this.#boardTasks[i].status === newStatus) {
          lastIndexOfSameStatus = i;
          break;
        }
      }
      insertionIndex = lastIndexOfSameStatus + 1;
      console.log(`[Model] Inserting ${draggedTaskId} after last task with status ${newStatus} at index ${insertionIndex}.`);

    } else {
      const targetTaskIndex = this.#boardTasks.findIndex(task => task.id === targetTaskId);

      if (targetTaskIndex === -1) {
        console.warn(`[Model] Target task ${targetTaskId} not found. Inserting at the end of status group ${newStatus}.`);
        let lastIndexOfSameStatus = -1;
        for (let i = this.#boardTasks.length - 1; i >= 0; i--) {
          if (this.#boardTasks[i].status === newStatus) {
            lastIndexOfSameStatus = i;
            break;
          }
        }
        insertionIndex = lastIndexOfSameStatus + 1;
      } else {
        insertionIndex = targetTaskIndex;
        console.log(`[Model] Inserting ${draggedTaskId} before task ${targetTaskId} at index ${insertionIndex}.`);
      }
    }
    this.#boardTasks.splice(insertionIndex, 0, draggedTask);
    console.log(`[Model] Task ${draggedTaskId} moved. New tasks order:`, this.#boardTasks.map(t => t.id));
    this.#notifyObservers();
  }


  getTasksByStatus(status) {
    return this.#boardTasks.filter(task => task.status === status);
  }

  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers.delete(observer);
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