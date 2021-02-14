"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var V4L2Driver = /** @class */ (function () {
    function V4L2Driver() {
        this.v4l2LoadCommand = 'pkexec';
        this.v4l2LoadArgs = [
            'modprobe',
            'v4l2loopback',
            'devices=1',
            'video_nr=10',
            'card_label="CamToWebcam"',
        ];
        this.v4l2UnloadCommand = 'pkexec';
        this.v4l2UnloadArgs = ['modprobe', '-r', 'v4l2loopback'];
    }
    V4L2Driver.prototype.load = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            child_process_1.exec(_this.v4l2LoadCommand + ' ' + _this.v4l2LoadArgs.join(' '), function (error, stdout, stderr) {
                console.log('V4l2 Load');
                if (error) {
                    console.error("Cannot load v4l2 module: " + error);
                    reject(error);
                    return;
                }
                resolve();
            });
            // return spawn(this.v4l2LoadCommand, this.v4l2LoadArgs);
        });
        return promise;
    };
    V4L2Driver.prototype.unload = function () {
        return child_process_1.spawn(this.v4l2UnloadCommand, this.v4l2UnloadArgs);
    };
    return V4L2Driver;
}());
exports["default"] = V4L2Driver;
//# sourceMappingURL=V4L2Driver.js.map