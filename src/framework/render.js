import AbstractComponent from './view/abstract-component.js';

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

function render(component, container, place = RenderPosition.BEFOREEND) {
  if (!(component instanceof AbstractComponent)) {
    throw new Error('Can render only AbstractComponent instances');
  }

  if (container === null) {
    throw new Error('Container element doesn\'t exist');
  }

  container.insertAdjacentElement(place, component.element);
}

function remove(component) {
  if (!(component instanceof AbstractComponent)) {
    throw new Error('Can remove only AbstractComponent instances');
  }

  if (component.element) {
    component.element.remove(); // Удаляем элемент из DOM
    component.removeElement();
  }
}
export { RenderPosition, createElement, render, remove };