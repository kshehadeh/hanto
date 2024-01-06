export function runGit(cmd: string, cwd: string) {
    return new Promise<string>((resolve, reject) => {
        const child = require('child_process').spawn('git', cmd.split(' '), {
            cwd,
        });

        let output = '';

        child.stdout.on('data', (data: string) => {
            output += data;
        });

        child.stderr.on('data', (data: string) => {
            output += data;
        });

        child.on('close', (code: number) => {
            if (code !== 0) {
                reject(new Error(output));
            } else {
                resolve(output);
            }
        });
    });
}
