const { ipcRenderer } = require('electron');

const btnNewTask = document.querySelector('#btnNewTask');
const tbodyTasks = document.querySelector('#tbodyTasks');

loadTasks();

btnNewTask.addEventListener('click', async () => {
  const task = await ipcRenderer.invoke('task:new');
});

ipcRenderer.on('task:reload', (e, arg) => {
  loadTasks();
});

function loadTasks() 
{
  ipcRenderer.invoke('task:load').then((tasks) => {
    tbodyTasks.innerHTML = '';

    if (tasks instanceof Array && tasks.length == 0) {
      let column = document.createElement('td');
      column.setAttribute('colspan', '2');  
      column.textContent = 'No added tasks';

      let row = document.createElement('tr');

      row.appendChild(column)

      tbodyTasks.appendChild(row);
    }

    tasks.map((task) => {
      const descriptionColumn = document.createElement('td');
      descriptionColumn.textContent = task.description;

      const actionColumn = document.createElement('td');
      const btnDone = document.createElement('button');

      if (!task.finished) {
        btnDone.setAttribute('class', 'btn btn-success btn-done');
        btnDone.innerText = 'Done';
      } else {
        descriptionColumn.style.textDecorationLine = 'line-through';
        btnDone.setAttribute('class', 'btn btn-danger btn-done');
        btnDone.setAttribute('disabled', true);
        btnDone.innerText = 'Finished';
      }

      btnDone.setAttribute('data-id', task.id);
      btnDone.addEventListener('click', async () => await ipcRenderer.send('task:done', task.id));
      
      actionColumn.appendChild(btnDone)

      const row = document.createElement('tr');
      row.append(descriptionColumn, actionColumn);

      tbodyTasks.appendChild(row);
    })
  });

}

//Fix de reload
window.addEventListener('focus', () => loadTasks());
