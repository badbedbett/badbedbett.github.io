// src/main.js
import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-task-add-component.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import TasksModel from './model/task-model.js';
import {render, RenderPosition} from './framework/render.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const tasksBoardContainer = document.querySelector('.taskboard');

const tasksModel = new TasksModel();

const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: tasksBoardContainer,
  tasksModel: tasksModel,
});

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);

function handleNewTaskFormSubmit(taskTitle) {
  tasksBoardPresenter.createTask(taskTitle);

  const inputField = formContainer.querySelector('#add-task');
  if (inputField) {
    inputField.value = '';
  } else {
    console.error('Could not find input field #add-task to clear.');
  }
}

const formAddTaskComponent = new FormAddTaskComponent({
  onClick: handleNewTaskFormSubmit 
});

render(formAddTaskComponent, formContainer);
tasksBoardPresenter.init();