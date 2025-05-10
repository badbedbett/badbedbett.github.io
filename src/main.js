import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-task-add-component.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import TasksModel from './model/task-model.js';
import {render, RenderPosition} from './framework/render.js';
import TasksApiService from './tasks-api-service.js';

const END_POINT = 'https://681efd55c1c291fa6635a82c.mockapi.io/';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const tasksBoardContainer = document.querySelector('.taskboard');

const tasksModel = new TasksModel({
  tasksApiService: new TasksApiService(END_POINT)
});

import TaskBoardComponent from './view/taskboard-component.js';
const tasksBoardComponent = new TaskBoardComponent();
render(tasksBoardComponent, tasksBoardContainer);

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
    console.error('Не удалось найти поле ввода #add-task для очистки.');
  }
}

const formAddTaskComponent = new FormAddTaskComponent({
  onClick: handleNewTaskFormSubmit
});

render(formAddTaskComponent, formContainer);
tasksBoardPresenter.init();