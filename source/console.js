import crossSpawn from 'cross-spawn';


/**
 * @param {String}   command
 * @param {String[]} [args]
 * @param {Object}   [options]
 *
 * @return {Promise<String>}
 *
 * @see https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawnsync_command_args_options
 */
export  function spawn(command, args, options) {

    var process = crossSpawn(command, args, options),  data = '';

    return  new Promise((resolve, reject) => {

        function exit(code, signal) {

            code ?
                reject(
                    Object.assign(new Error( signal ),  { code, process })
                )  :
                resolve( data );
        }

        process.on('exit', exit),  process.on('close', exit),
        process.on('error', reject),  process.on('disconnect', reject);

        if ( process.stdout )
            process.stdout.on('data',  chunk => data += chunk);
    });
}


/**
 * Ensure a Global NPM command installed
 *
 * @param {String} name - Command name
 * @param {String} [ID] - Package name
 */
export  async function ensureCommand(name, ID) {
    try {
        await spawn(name, ['-h']);

    } catch (error) {

        await spawn('npm',  ['install',  ID || (name + '-cli'),  '-g']);
    }
}


var index = 0;
/**
 * @param {String}                                                  title
 * @param {function(index: Number, title: String, end: Boolean): *} logic
 * @param {Boolean}                                                 [end] - `true` to reset index
 *
 * @return {*} Data returned by `logic`
 */
export  function step(title, logic, end) {

    title = ` ${++index}. ${title}`;

    console.info(`\n${title}\n ${'-'.repeat(title.length - 1)}`);

    logic = logic(index, title, end);

    if ( end )  index = 0;

    return logic;
}
