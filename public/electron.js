"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var CamToWebcam_1 = require("./CamToWebcam");
var NoiseCancelling_1 = require("./NoiseCancelling");
var path = require("path");
var assetsPath = path.join(__dirname, '..', 'assets');
var IMAGE_ACTIVE_CAM = path.join(assetsPath, 'camera_active.png');
var IMAGE_INACTIVE_CAM = path.join(assetsPath, 'camera_inactive.png');
var camToWebcam = new CamToWebcam_1["default"]();
var noiseCancelling = new NoiseCancelling_1["default"]();
electron_1.app.whenReady().then(function () {
    var appIcon = new electron_1.Tray(IMAGE_INACTIVE_CAM);
    var contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: 'Connect camera',
            type: 'checkbox',
            click: function (menuItem, browserWindow, event) {
                if (!menuItem.checked) {
                    camToWebcam.disconnect();
                }
                else {
                    menuItem.checked = false;
                    camToWebcam
                        .connect()
                        .then(function (process) {
                        appIcon.setImage(IMAGE_ACTIVE_CAM);
                        menuItem.checked = true;
                        process.on('disconnect', function () {
                            console.log('Disconnected');
                        });
                        process.on('exit', function () {
                            console.log('Connection closed.');
                            appIcon.setImage(IMAGE_INACTIVE_CAM);
                            menuItem.checked = false;
                        });
                        process.on('error', function (error) {
                            console.error(error);
                            appIcon.setImage(IMAGE_INACTIVE_CAM);
                            menuItem.checked = false;
                        });
                    })["catch"](function (error) {
                        console.error(error);
                        appIcon.setImage(IMAGE_INACTIVE_CAM);
                        menuItem.checked = false;
                    });
                }
            }
        },
        {
            label: 'Enable Noise Cancelling',
            type: 'checkbox',
            click: function (menuItem, browserWindow, event) {
                if (!menuItem.checked) {
                    noiseCancelling
                        .disable()["catch"](function (error) { return console.error(error); });
                }
                else {
                    noiseCancelling
                        .enable()["catch"](function (error) { return console.error(error); });
                }
            }
        },
        {
            label: 'Exit',
            type: 'normal',
            click: function (browserWindow, event) {
                camToWebcam.disconnect();
                // without timeout the camera wouldnt be disconnected properly
                setTimeout(function () {
                    if (process.platform !== "darwin") {
                        electron_1.app.quit();
                    }
                }, 2000);
            }
        },
    ]);
    // Make a change to the context menu
    contextMenu.items[1].checked = false;
    // Call this again for Linux because we modified the context menu
    appIcon.setContextMenu(contextMenu);
});
// app.on(`ready`, createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=electron.js.map