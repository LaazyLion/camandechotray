import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import V4L2Driver from './V4L2Driver';

export default class CamToWebcam {
    v4L2Driver = new V4L2Driver();

    gphoto2: ChildProcessWithoutNullStreams | undefined;
    gphoto2Command = 'gphoto2';
    gphoto2Args = ['--stdout', '--capture-movie'];

    ffmpeg: ChildProcessWithoutNullStreams | undefined;
    ffmpegCommand = 'ffmpeg';
    ffmpegArgs = [
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

    connect() {
        const promise = new Promise<ChildProcessWithoutNullStreams>(
            (resolve, reject) => {
                this.v4L2Driver
                    .load()
                    .then(() => {
                        console.log('Spawn gphoto2 and ffmpeg');
                        this.gphoto2 = spawn(
                            this.gphoto2Command,
                            this.gphoto2Args,
                        );
                        this.ffmpeg = spawn(
                            this.ffmpegCommand,
                            this.ffmpegArgs,
                        );
                        this.gphoto2.stdout.pipe(this.ffmpeg.stdin);
                        this.ffmpeg.stdout.pipe(process.stdout);
                        this.ffmpeg.stderr.pipe(process.stderr);

                        resolve(this.gphoto2);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            },
        );

        return promise;
    }

    disconnect() {
        this.gphoto2?.kill('SIGINT');
    }
}
