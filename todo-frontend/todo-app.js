(function () {
  let tasksArr = [];

  function createTodoItem(task, listName) {

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    let item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = task.name;
    item.id = task.id;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');

    if (task.done) {
      item.classList.add('list-group-item-success');
    }

    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      task.done = !task.done;
      saveToLocalStorage(listName, tasksArr);
    });

    deleteButton.addEventListener('click', function () {
      if (confirm("Вы уверены?")) {
        item.remove();
        for (task of tasksArr) {
          if (task.id == item.id) {
            //array.splice(индекс, с которого начинается удаление, количество удаляемых элементов, добавляемый элемент)
            tasksArr.splice(tasksArr.indexOf(task), 1);
            saveToLocalStorage(listName, tasksArr);
          }
        }
      }
    });

    return {
      // task,
      item,
      doneButton,
      deleteButton,
    };

  }

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input, buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function dataFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function saveToLocalStorage(key, data) {
    return localStorage.setItem(key, JSON.stringify(data));
  }

  function createTodoApp(container, title = 'Список дел', listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    container.append(todoAppTitle, todoItemForm.form, todoList);

    tasksArr = dataFromLocalStorage(listName);
    if (!tasksArr) {
      tasksArr = [];
    }

    for (let task of tasksArr) {
      let todoItem = createTodoItem(task, listName);
      todoList.append(todoItem.item);
    };

    todoItemForm.input.addEventListener('input', function () {
      todoItemForm.button.disabled = !todoItemForm.input.value.trim();
    });

    todoItemForm.form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          name: todoItemForm.input.value.trim(),
          owner: 'Татьяна',
        }),
        headers: {
            'Content-Type': 'application/JSON',
        }
      });

      const todoItem = await response.json();

      let id = 1;

      if (tasksArr.length) {
        //slice(-1) создаёт новый массив, состоящий только из последнего элемента, slice(-1)[0] - обращается к объекту внутри массива, имеющему нулевой индекс, выводит не массив, а объект.
        id = tasksArr.slice(-1)[0].id + 1;
      }

      let task = {name: todoItem.name, done: false, id: id};
      const todoItemElement = createTodoItem(task, listName);

      todoList.append(todoItemElement.item);
      tasksArr.push(task);
      saveToLocalStorage(listName, tasksArr);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;

    });
  }

  window.createTodoApp = createTodoApp;

})();
