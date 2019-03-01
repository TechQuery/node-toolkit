import { readdirSync, readFileSync } from 'fs';

import { join, resolve } from 'path';

import MIME from 'mime';

import fileType from 'file-type';


/**
 * @param {String|RegExp} name       - Pattern of File name
 * @param {String}        [path='.']
 *
 * @return {?String} File path
 */
export function findFile(name, path = '.') {

    name = readdirSync( path ).find(file  =>  file.match( name ));

    if ( name )  return join(path, name);
}


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

        let file = readdirSync(from = path);

        while ( file[0] )  yield  join(path, file.shift());
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
