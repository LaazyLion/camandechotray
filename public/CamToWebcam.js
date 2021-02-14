"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var V4L2Driver_1 = require("./V4L2Driver");
var CamToWebcam = /** @class */ (function () {
    function CamToWebcam() {
        this.v4L2Driver = new V4L2Driver_1["default"]();
        this.gphoto2Command = 'gphoto2';
        this.gphoto2Args = ['--stdout', '--capture-movie'];
        this.ffmpegCommand = 'ffmpeg';
        this.ffmpegArgs = [
            '-i',
            '-',
            '-f',
            'rawvideo',
            '-pix_fmt',
            'yuv420p',
            '-threads',
            '0',
            '-s:v',
            '1280x720',
            '-r',
            '25',
            '-f',
            'v4l2',
            '/dev/video10',
        ];
    }
    CamToWebcam.prototype.connect = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.v4L2Driver
                .load()
                .then(function () {
                console.log('Spawn gphoto2 and ffmpeg');
                _this.gphoto2 = child_process_1.spawn(_this.gphoto2Command, _this.gphoto2Args);
                _this.ffmpeg = child_process_1.spawn(_this.ffmpegCommand, _this.ffmpegArgs);
                _this.gphoto2.stdout.pipe(_this.ffmpeg.stdin);
                _this.ffmpeg.stdout.pipe(process.stdout);
                _this.ffmpeg.stderr.pipe(process.stderr);
                resolve(_this.gphoto2);
            })["catch"](function (error) {
                reject(error);
            });
        });
        return promise;
    };
    CamToWebcam.prototype.disconnect = function () {
        var _a;
        (_a = this.gphoto2) === null || _a === void 0 ? void 0 : _a.kill('SIGINT');
    };
    return CamToWebcam;
}());
exports["default"] = CamToWebcam;
//# sourceMappingURL=CamToWebcam.js.map