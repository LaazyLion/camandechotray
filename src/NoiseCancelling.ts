import { exec } from 'child_process';

export default class NoiseCancelling {
    unloadNoiseCancelCommand = 'pactl unload-module module-echo-cancel';
    noiseCancelCommands = [
        'pactl load-module module-echo-cancel use_master_format=1 aec_method=webrtc aec_args=\\"analog_gain_control=0 digital_gain_control=1 agc_start_volume=51\\" source_name=echocancel sink_name=echocancel1',
        'pacmd set-default-source echocancel',
        'pacmd set-default-sink echocancel1',
    ];

    enable() {
        const promise = new Promise<void>((resolve, reject) => {
            console.log('Load module-echo-cancel');

            exec(
                this.unloadNoiseCancelCommand +
                    ' && ' +
                    this.noiseCancelCommands.join(' && '),
                (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                },
            );
        });

        return promise;
    }

    disable() {
        const promise = new Promise<void>((resolve, reject) => {
            console.log('Unload module-echo-cancel');

            exec(this.unloadNoiseCancelCommand, (error) => reject(error));
            resolve();
        });

        return promise;
    }
}
