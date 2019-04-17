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


const DataURI_pattern = /^data:(.+?\/(.+?))?(;base64)?,(\S+)/;

/**
 * @param {String} DataURI - https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * @return   {Object}
 * @property {String} MIME      - [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_Types)
 * @property {String} extension - Extension name of a File
 * @property {Buffer} data
 */
export function blobFrom(DataURI) {

    var [MIME, extension, base64, data] = (
        DataURI_pattern.exec( DataURI )  ||  [ ]
    ).slice(1);

    data = Buffer.from(data, base64 ? 'base64' : 'utf-8');

    return {
        MIME:      MIME  ||  (fileType( data ) || '').mime,
        extension,
        data
    };
}
