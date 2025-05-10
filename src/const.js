const Status = {
  BACKLOG: 'backlog',
  PROCESSING: 'processing',
  DONE: 'done',
  BASKET: 'basket',
};

const StatusLabel = {
  [Status.BACKLOG]: 'Бэклог',
  [Status.PROCESSING]: 'В процессе',
  [Status.DONE]: 'Готово',
  [Status.BASKET]: 'Корзина',
};

export { Status, StatusLabel };

export const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};