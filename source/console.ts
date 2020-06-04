import { SpawnOptions } from 'child_process';
import crossSpawn from 'cross-spawn';

/**
 * @see https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawnsync_command_args_options
 */
export function spawn(command: string, args: string[], options?: SpawnOptions) {
    const process = crossSpawn(command, args, options);

    return new Promise<string>((resolve, reject) => {
        let data = '';

        function exit(code: number, signal: string) {
            code
                ? reject(Object.assign(new Error(signal), { code, process }))
                : resolve(data);
        }

        process.on('exit', exit),
            process.on('close', exit),
            process.on('error', reject),
            process.on('disconnect', reject);

        process.stdout?.on('data', chunk => (data += chunk));
    });
}

/**
 * Ensure a Global NPM command installed
 */
export async function ensureCommand(command: string, library?: string) {
    try {
        await spawn(command, ['-h']);
    } catch {
        await spawn('npm', ['install', library || command + '-cli', '-g']);
    }
}

let index = 0;

export function step<T>(
    title: string,
    logic: (index: number, title: string, end: boolean) => T,
    reset?: boolean
): T {
    title = ` ${++index}. ${title}`;

    console.info(`\n${title}\n ${'-'.repeat(title.length - 1)}`);

    const result = logic(index, title, reset);

    if (reset) index = 0;

    return result;
}
