// Speed
// by Ben Crowder

var app = require('app');
var BrowserWindow = require('browser-window');

var Menu = require('menu');
var MenuItem = require('menu-item');

// Report crashes to our server
require('crash-reporter').start({ companyName: 'bencrowder', submitURL: 'http://bencrowder.net/coding/speed/' });

// Keep global references of the window objects, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var win;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});


// Menu
var template = [
	{
		label: 'Speed',
		submenu: [
		{
			label: 'About Speed',
			selector: 'orderFrontStandardAboutPanel:'
		},
		{
			type: 'separator'
		},
		{
			label: 'Hide Speed',
			accelerator: 'CmdOrCtrl+H',
			selector: 'hide:'
		},
		{
			label: 'Hide Others',
			accelerator: 'CmdOrCtrl+Shift+H',
			selector: 'hideOtherApplications:'
		},
		{
			label: 'Show All',
			selector: 'unhideAllApplications:'
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			accelerator: 'CmdOrCtrl+Q',
			selector: 'terminate:'
		},
		]
	},
	{
		label: 'Edit',
		submenu: [
		{
			label: 'Copy',
			accelerator: 'CmdOrCtrl+C',
			selector: 'copy:'
		},
		{
			label: 'Select All',
			accelerator: 'CmdOrCtrl+A',
			selector: 'selectAll:'
		}
		]
	},
];

app.on('ready', function() {
	win = new BrowserWindow({ width: 600, height: 600 });
	win.loadURL('file://' + __dirname + '/index.html');
	win.on('closed', function() {
		win = null;
	});
//	win.toggleDevTools();

	menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
});
