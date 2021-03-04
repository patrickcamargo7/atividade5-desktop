const { Menu, ipcMain } = require('electron');

let mainMenu;

exports.appMenu = (window, createTask, createAbout) => {
 

  const template = [
    {
      label: 'File',
      submenu: [
        {
          id: 'new',
          label: 'Add new Task',
          click: () => {
            createTask()
          },
          accelerator: 'CommandOrControl+N',
        },
        {
          id: 'about',
          label: 'About',
          click: () => {
            createAbout()
          },
          accelerator: 'CommandOrControl+B',
        },
        {
          id: 'close',
          label: 'Close',
          click: () => {
            window.webContents.send('menu-delete-click');
          },
          accelerator: 'CommandOrControl+Backspace',
        },
      ],
    },
    {
      role: 'editMenu',
    },
    {
      role: 'toggleDevTools',
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      role: 'appMenu',
    });
  }

  this.mainMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(this.mainMenu);
};

const setMenuItemStatus = (id, enable) => {
  const menuItem = this.mainMenu.getMenuItemById(id);
  menuItem.enabled = enable;
};

ipcMain.on('action-enable-menu', (e, config) => {
  if (config.disable) {
    config.disable.forEach(id => setMenuItemStatus(id, false));
  }
  if (config.enable) {
    config.enable.forEach(id => setMenuItemStatus(id, true));
  }
});