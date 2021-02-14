# CamAndEcho
A tray application for using a e.g. dslr camera as webcam and for activating the echo-cancel-module of pulseaudio.
</br>
<img src="./screenshot.png">
</br>
Just connect your camera via USB an click "Connect camera".
In your app of choice, select the camera input source "CamToWebcam"


# Setup
## Dependencies
- gphoto2
- ffmpeg
- v4l2loopback-utils
- v4l2loopback-dkms

On Debian based OS:</br>
```sudo apt-get install gphoto2 ffmpeg v4l2loopback-utils v4l2loopback-dkms```
</br></br>
On Redhat base OS:</br>
```sudo dnf install gphoto2 ffmpeg v4l2loopback```

## Run the code
First of all in the root directory, run following command to install all dependencies:
```yarn```

- Start the application: ```yarn start```
- Build the application: ```yarn dist```

```yarn dist``` creates a .deb, appimage and the unpacked application in the ```dist``` folder.

# Tested setup
- OS: Pop OS 20.10
- Camera: Canon EOS 200D