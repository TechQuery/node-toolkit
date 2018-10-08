import { transform } from '@babel/core';

import { format } from 'prettier';

import { deepStrictEqual } from 'assert';


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
 * @param {String} source - JS source code
 *
 * @return {String} Prettified JS code
 */
export function prettify(source) {

    return  format(source, {
        parser:       'babylon',
        tabWidth:     4,
        singleQuote:  true
    }).trim();
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
        plugins:     ['@babel/plugin-transform-modules-commonjs'],
        ast:         false,
        filename:    fileName || undefined,
        babelrc:     !onlyModule,
        parserOpts:  {
            plugins:  [
                'optionalCatchBinding', 'objectRestSpread', 'asyncGenerators',
                'classProperties', [
                    'decorators',  {decoratorsBeforeExport: true}
                ],
                'importMeta', 'dynamicImport',
                'exportDefaultFrom', 'exportNamespaceFrom'
            ]
        }
    };

    if (! onlyModule)  option.presets = ['@babel/preset-env'];

    return prettify(
        transform(code, option).code.replace(
            /^(?:'|")use strict(?:'|");\n+/,  ''
        )
    );
}


/**
 * @param {Function} func - Original function
 *
 * @return {Function} Wrapped function with result cache
 */
export function cache(func) {

    const result = new Map();

    return  function (...parameter) {

        for (let [input, output]  of  result)  try {

            deepStrictEqual(input, parameter);  return output;

        } catch (error) {/**/}

        const output = func.apply(this, parameter);

        result.set(parameter, output);

        return output;
    };
}
