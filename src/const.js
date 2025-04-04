const Status = {
    BACKLOG: 'backlog',
    PROCESSING: 'processing',
    DONE: 'done',
    BASKET: 'basket' // Добавлен basket (если он у тебя используется)
  };
  
  const StatusLabel = {
    [Status.BACKLOG]: 'Бэклог',
    [Status.PROCESSING]: 'В процессе',
    [Status.DONE]: 'Готово',
    [Status.BASKET]: 'Корзина'
  };
  
  export { Status, StatusLabel };