// src/presenter/tasks-board-presenter.js

import TasksListComponent from '../view/task-list-component.js';
import TaskComponent from '../view/task-component.js';
import TaskBoardComponent from '../view/taskboard-component.js';
import DeleteButtonComponent from '../view/delete-btn-component.js';
import NoTasksComponent from '../view/no-tasks-component.js';
import { render, remove } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange);
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

  #handleTaskDrop = (draggedTaskId, newStatus, targetTaskId) => {
    console.log(`[Presenter] Handling drop: Task ${draggedTaskId} to Status ${newStatus}, Target Task: ${targetTaskId}`);
    this.#tasksModel.moveTask(draggedTaskId, newStatus, targetTaskId);
  };

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderNoTasks(container) {
    const noTasksComponent = new NoTasksComponent();
    render(noTasksComponent, container);
  }

  #renderDeleteButtonComponent(container, hasTasks) {
    const deleteButtonComponent = new DeleteButtonComponent({
      onClick: this.#handleClearBasketClick,
      isDisabled: !hasTasks
    });
    render(deleteButtonComponent, container);
  }

  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }

  #handleModelChange = () => {
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderBoard() {
    if (!this.#boardContainer.contains(this.#tasksBoardComponent.element)) {
      render(this.#tasksBoardComponent, this.#boardContainer);
    }
    const currentTasks = this.tasks;
    Object.values(Status).forEach((status) => {
      const tasksListComponent = new TasksListComponent({
        status: status,
        onTaskDrop: this.#handleTaskDrop.bind(this),
      });

      render(tasksListComponent, this.#tasksBoardComponent.element);

      const tasksForStatus = currentTasks.filter(task => task.status === status);
      const listElement = tasksListComponent.element.querySelector('.task-list');

      if (!listElement) {
        console.error(`Element '.task-list' not found within TaskListComponent for status '${status}'`);
        return;
      }

      if (tasksForStatus.length === 0) {
        this.#renderNoTasks(listElement);
      } else {

        tasksForStatus.forEach((task) => {
          this.#renderTask(task, listElement);
        });
      }
      if (status === Status.BASKET) {
        this.#renderDeleteButtonComponent(tasksListComponent.element, tasksForStatus.length > 0);
      }
    });
  }
}