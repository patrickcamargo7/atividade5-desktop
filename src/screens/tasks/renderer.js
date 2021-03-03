const { ipcRenderer } = require('electron');

const btnSaveTask = document.querySelector('#btnSaveTask');
const inputTaskDescription = document.querySelector('#inputTaskDescription');

btnSaveTask.addEventListener('click', () => {
    ipcRenderer.send('task:save', {description: inputTaskDescription.value, finished: false});
})