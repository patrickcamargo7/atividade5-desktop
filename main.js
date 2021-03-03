const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { v4: uuidv4 } = require('uuid');

let tasks = [
  {
    id: 2,
    description: 'first',
    finished: false,
  }
]

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
  e.reply('task:reload', 'reload')
  console.log('\n\nSalvando...')
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