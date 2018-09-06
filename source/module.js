import { readFileSync } from 'fs';

import { toRegExp } from './language';

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

    config = config  ||  JSON.parse( readFileSync(`./${name}.json`) );

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
