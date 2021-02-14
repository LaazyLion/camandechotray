"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var NoiseCancelling = /** @class */ (function () {
    function NoiseCancelling() {
        this.unloadNoiseCancelCommand = 'pactl unload-module module-echo-cancel';
        this.noiseCancelCommands = [
            'pactl load-module module-echo-cancel use_master_format=1 aec_method=webrtc aec_args=\\"analog_gain_control=0 digital_gain_control=1 agc_start_volume=51\\" source_name=echocancel sink_name=echocancel1',
            'pacmd set-default-source echocancel',
            'pacmd set-default-sink echocancel1',
        ];
    }
    NoiseCancelling.prototype.enable = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            console.log('Load module-echo-cancel');
            child_process_1.exec(_this.unloadNoiseCancelCommand +
                ' && ' +
                _this.noiseCancelCommands.join(' && '), function (error, stdout, stderr) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
        return promise;
    };
    NoiseCancelling.prototype.disable = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            console.log('Unload module-echo-cancel');
            child_process_1.exec(_this.unloadNoiseCancelCommand, function (error) { return reject(error); });
            resolve();
        });
        return promise;
    };
    return NoiseCancelling;
}());
exports["default"] = NoiseCancelling;
//# sourceMappingURL=NoiseCancelling.js.map