import { app, Menu, Tray } from 'electron';
import CamToWebcam from './CamToWebcam';
import NoiseCancelling from './NoiseCancelling';
import path = require('path');

const assetsPath = path.join(__dirname, '..', 'assets');
const IMAGE_ACTIVE_CAM = path.join(assetsPath, 'camera_active.png');
const IMAGE_INACTIVE_CAM = path.join(assetsPath, 'camera_inactive.png');

const camToWebcam = new CamToWebcam();
const noiseCancelling = new NoiseCancelling();

app.whenReady().then(() => {
    const appIcon = new Tray(IMAGE_INACTIVE_CAM);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Connect camera',
            type: 'checkbox',
            click: (menuItem, browserWindow, event) => {
                if (!menuItem.checked) {
                    camToWebcam.disconnect();
                } else {
                    menuItem.checked = false;
                    camToWebcam
                        .connect()
                        .then((process) => {
                            appIcon.setImage(IMAGE_ACTIVE_CAM);
                            menuItem.checked = true;

                            process.on('disconnect', () => {
                                console.log('Disconnected');
                            });
                            process.on('exit', () => {
                                console.log('Connection closed.');
                                appIcon.setImage(IMAGE_INACTIVE_CAM);
                                menuItem.checked = false;
                            });
                            process.on('error', (error) => {
                                console.error(error);
                                appIcon.setImage(IMAGE_INACTIVE_CAM);
                                menuItem.checked = false;
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            appIcon.setImage(IMAGE_INACTIVE_CAM);
                            menuItem.checked = false;
                        });
                }
            },
        },
        {
            label: 'Enable Noise Cancelling',
            type: 'checkbox',
            click: (menuItem, browserWindow, event) => {
                if (!menuItem.checked) {
                    noiseCancelling
                        .disable()
                        .catch((error) => console.error(error));
                } else {
                    noiseCancelling
                        .enable()
                        .catch((error) => console.error(error));
                }
            },
        },
        {
            label: 'Exit',
            type: 'normal',
            click: (browserWindow, event) => {
                camToWebcam.disconnect();

                // without timeout the camera wouldnt be disconnected properly
                setTimeout(() => {
                    if (process.platform !== `darwin`) {
                        app.quit();
                    }
                }, 2000);
            },
        },
    ]);

    // Make a change to the context menu
    contextMenu.items[1].checked = false;

    // Call this again for Linux because we modified the context menu
    appIcon.setContextMenu(contextMenu);
});
// app.on(`ready`, createWindow);

app.on(`window-all-closed`, () => {
    if (process.platform !== `darwin`) {
        app.quit();
    }
});
