import { join, resolve } from 'path';

import { readdirSync, readFileSync } from 'fs';

import MIME from 'mime';

import fileType from 'file-type';


/**
 * Find files upward
 *
 * @param {String} [from='./'] - Find up from a path
 *
 * @yield {String} Full file name
 */
export function* findUp(from = './') {

    from = resolve( from );

    while ( true ) {

        let path = join(from, '../');

        if (path === from)  break;

        for (let file  of  readdirSync(from = path))
            yield  join(path, file);
    }
}

/**
 * @param {String} path - File path
 *
 * @return {String}
 */
export function toDataURI(path) {

    const file = readFileSync( path );

    const type = fileType( file );

    return `data:${
        type  ?  type.mime  :  MIME.getType( path )
    };base64,${
        file.toString('base64')
    }`;
}
