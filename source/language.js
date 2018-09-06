import { transform } from '@babel/core';


/**
 * @param {string} raw - RegExp literal string
 *
 * @return {?RegExp}
 */
export function toRegExp(raw) {

    const match = raw.match( /^\/?(.+?)(?:\/([a-z]+)?)?$/ );

    if ( match )  return  new RegExp(match[1], match[2]);
}


/**
 * @param {string}  code         - ES 6+ source code
 * @param {?string} fileName     - Full name of this JS file
 * @param {boolean} [onlyModule] - Only transform ES 6 module to CommonJS
 *
 * @return {string} ES 5 source code
 */
export function toES_5(code, fileName, onlyModule) {

    const option = {
        plugins:   ['@babel/plugin-transform-modules-commonjs'],
        ast:       false,
        filename:  fileName || undefined
    };

    if (! onlyModule)  option.presets = ['@babel/preset-env'];

    return  transform(code, option).code.replace(
        /^(?:'|")use strict(?:'|");\n+/,  ''
    );
}
