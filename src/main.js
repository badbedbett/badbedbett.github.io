import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-task-add-component.js';
import TaskboardComponent from './view/taskboard-component.js';
import TaskComponent from './view/task-component.js';
import {render, RenderPosition} from './framework/render.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const taskboardContainer = document.querySelector('.taskboard');

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new FormAddTaskComponent(), formContainer);

render(new TaskboardComponent(), taskboardContainer);

const backlogColumn = taskboardContainer.querySelector('.backlog');
const inProgressColumn = taskboardContainer.querySelector('.in-progress');
const doneColumn = taskboardContainer.querySelector('.done');
const trashColumn = taskboardContainer.querySelector('.trash');


render(new TaskComponent("Выучить JS"), backlogColumn);
render(new TaskComponent("Выучить React"), backlogColumn);
render(new TaskComponent("Сделать домашку"), backlogColumn);

render(new TaskComponent("Выпить смузи"), inProgressColumn);
render(new TaskComponent("Попить воды"), inProgressColumn);

render(new TaskComponent("Позвонить маме"), doneColumn);
render(new TaskComponent("Погладить кота"), doneColumn);

render(new TaskComponent("Сходить погулять"), trashColumn);
render(new TaskComponent("Прочитать Войну и Мир"), trashColumn);