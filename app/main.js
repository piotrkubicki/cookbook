const app = require('app');
const BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-close', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('close', function() {
    mainWindow = null;
  });
});
