import { exec, spawn } from 'child_process';

export default class V4L2Driver {
    v4l2LoadCommand = 'pkexec';
    v4l2LoadArgs = [
        'modprobe',
        'v4l2loopback',
        'devices=1',
        'video_nr=10',
        'card_label="CamToWebcam"',
    ];

    v4l2UnloadCommand = 'pkexec';
    v4l2UnloadArgs = ['modprobe', '-r', 'v4l2loopback'];

    load(): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            exec(
                this.v4l2LoadCommand + ' ' + this.v4l2LoadArgs.join(' '),
                (error, stdout, stderr) => {
                    console.log('V4l2 Load');
                    if (error) {
                        console.error(`Cannot load v4l2 module: ${error}`);
                        reject(error);
                        return;
                    }

                    resolve();
                },
            );
            // return spawn(this.v4l2LoadCommand, this.v4l2LoadArgs);
        });

        return promise;
    }

    unload() {
        return spawn(this.v4l2UnloadCommand, this.v4l2UnloadArgs);
    }
}
