const { Menu, ipcMain } = require('electron');

let mainMenu;

exports.appMenu = window => {
  // const template = [
  //   {
  //     label: 'File',
  //     submenu: [
  //       {
  //         label: 'New',
  //         click: () => {
  //           console.log('MAIN PROCESS: MenuItem New clicked');
  //           window.webContents.send('menu-new-click');
  //         },
  //         accelerator: 'CommandOrControl+N'
  //       },
  //       {
  //         label: 'Save',
  //       },
  //       {
  //         label: 'Close',
  //       },
  //       ,
  //       {
  //         role: 'toggleDevTools',
  //       },
  //     ],
  //   },
  //   {
  //     label: 'Edit',
  //     submenu: [
  //       {
  //         label: 'Copy',
  //         role: 'copy',
  //       },
  //       {
  //         label: 'Paste',
  //         role: 'paste',
  //       },
  //     ],
  //   },
  //   {
  //     label: 'Options',
  //     submenu: [
  //       {
  //         label: 'Option 1',
  //         type: 'radio',
  //       },
  //       {
  //         label: 'Option 2',
  //         type: 'radio',
  //       },
  //       {
  //         label: 'Option 3',
  //         type: 'radio',
  //       },
  //       {
  //         type: 'separator',
  //       },
  //       {
  //         label: 'Dark Mode',
  //         type: 'checkbox',
  //       },
  //     ],
  //   },
  //   {
  //     label: 'Edit (ready)',
  //     role: 'editMenu',
  //   },
  //   {
  //     label: 'File (ready)',
  //     role: 'fileMenu',
  //   },
  //   {
  //     label: 'Window',
  //     role: 'windowMenu',
  //   },
  // ];

  const template = [
    {
      label: 'File',
      submenu: [
        {
          id: 'new',
          label: 'Add new Item',
          click: () => {
            window.webContents.send('menu-add-click');
          },
          accelerator: 'CommandOrControl+N',
        },
        {
          id: 'delete',
          label: 'Delete Items',
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