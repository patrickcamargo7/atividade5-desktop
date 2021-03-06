const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

const Store = require('electron-store');
const store = new Store();
const storageKey = 'todo';

const { appMenu } = require('./menu');

let tasks = store.get(storageKey)
  
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  mainWindow.loadFile('./src/screens/home/index.html')

  appMenu(mainWindow, createTask, createAbout);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

let createTaskWindow

ipcMain.handle('task:new', async () => {
  createTaskWindow = createTask()
  
  createTaskWindow.show()
});

ipcMain.on('task:save', async (e, task) => {
  try {
    task = {...task, id: uuidv4() }
    tasks.push(task) 
    createTaskWindow.close()
    store.set(storageKey, tasks);
    e.reply('task:reload', 'reload')

  } catch (e) {
    console.log(e);
  }
});

ipcMain.on('task:done', async (e, id) => {
  tasks = tasks.map((task) => {
    if (task.id == id) { 
      return {
        ...task,
        finished: true,
      }
    }
    return task
  })
  store.set(storageKey, tasks);
  e.reply('task:reload', 'reload')
});

ipcMain.handle('task:load', async () => {
  return tasks
});

function createTask() {
  const createTaskWindow = new BrowserWindow({
    visible: false,
    width: 300,
    height: 300,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  createTaskWindow.loadFile('./src/screens/tasks/new_task.html')

  createTaskWindow.once("ready-to-show", () => {
    createTaskWindow.show()
  })

  return createTaskWindow
}

function createAbout() {
  const aboutWindow = new BrowserWindow({
    visible: false,
    width: 300,
    height: 300,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  aboutWindow.loadFile('./src/screens/about/index.html')

  aboutWindow.once("ready-to-show", () => {
    aboutWindow.show()
  })

  return aboutWindow
}