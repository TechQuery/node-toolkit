import { readFileSync, existsSync } from 'fs';

import { toRegExp } from './language';

import { findUp } from './file';

import { basename, dirname } from 'path';

import { execSync } from 'child_process';


/**
 * Get configuration of a Package from `package.json` or `${name}.json` in `process.cwd()`
 *
 * @param {string} name
 *
 * @return {?Object} (`process.env.NODE_ENV` will affect the result)
 */
export function configOf(name) {

    var config = JSON.parse( readFileSync('./package.json') )[ name ];

    if (!config  &&  existsSync(name = `./${name}.json`))
        config = JSON.parse( readFileSync( name ) );

    if ( config )
        return  config.env  ?  config.env[ process.env.NODE_ENV ]  :  config;
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
                meta:  JSON.parse( readFileSync( file ) )
            };
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
