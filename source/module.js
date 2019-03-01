import { resolve, basename, dirname } from 'path';

import { readJSONSync, existsSync, readFileSync } from 'fs-extra';

import { toRegExp } from './language';

import { findUp } from './file';

import { parse } from 'yaml';

import { execSync } from 'child_process';


/**
 * @param {String} path
 *
 * @return {String}
 */
export  function packageNameOf(path) {

    path = resolve( path ).split( /[/\\]+/ );

    path = path.slice((path.slice(-2)[0][0] === '@')  ?  -2  :  -1).join('/');

    return  path.toLowerCase().replace(/[^@/\w]+/g, '-');
}


/**
 * @param {Object} map - Key for RegExp source, value for replacement
 *
 * @return {?Object} Key for replacement, value for RegExp
 */
export function patternOf(map) {

    var patternMap = { }, count = 0;

    for (let pattern in map)
        patternMap[ map[ pattern ] ] = toRegExp( pattern ),  count++;

    return  count ? patternMap : null;
}


/**
 * @return {string}
 */
export function currentModulePath() {

    try {  throw Error();  } catch (error) {

        return  error.stack.split( /[\r\n]+/ )[2]
            .match( /at .+?\((.+):\d+:\d+\)/ )[1].replace(/\\/g, '/');
    }
}

/**
 * @param {String} [path='./']
 *
 * @return   {?Object}
 * @property {String}  path - Root path of this package
 * @property {Object}  meta - Data of `package.json`
 */
export function packageOf(path = './') {

    for (let file  of  findUp( path ))
        if (basename( file )  ===  'package.json')
            return {
                path:  dirname( file ),
                meta:  readJSONSync( file )
            };
}


/**
 * Get configuration of a Package from
 * `package.json`, `.${name}.json` or `.${name}.yml` in `process.cwd()`
 *
 * @param {string} name
 *
 * @return {?Object} (`process.env.NODE_ENV` will affect the result)
 */
export function configOf(name) {

    var config = ((packageOf('./test') || '').meta || '')[ name ];

    if (! config)
        for (let type  of  ['json', 'yaml', 'yml'])
            if (existsSync(name = `./.${name}.${type}`)) {

                switch ( type ) {
                    case 'json':    config = readJSONSync( name );  break;
                    case 'yaml':
                    case 'yml':     config = parse(readFileSync( name ) + '');
                }
                break;
            }

    if ( config )
        return  config.env  ?  config.env[ process.env.NODE_ENV ]  :  config;
}


/**
 * @param {string} key
 *
 * @return {?*}
 */
export function getNPMConfig(key) {

    const value = (execSync(`npm get ${key}`) + '').trim();

    if (value !== 'undefined')
        try {
            return  JSON.parse( value );

        } catch (error) {  return value;  }
}


/**
 * @param {string} key
 * @param {?*}     value
 */
export function setNPMConfig(key, value) {

    execSync(
        (value != null)  ?
            `npm set ${key} ${value}`  :  `npm config delete ${key}`
    );

    console.info(`${key} = ${value}`);
}
