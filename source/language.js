import { transform } from '@babel/core';

import { format } from 'prettier';

import { minify } from 'uglify-js';

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
        parser:       'babel',
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
 * @param {String} source   - JS source code
 * @param {String} filename - Name of this JS source file
 *
 * @return   {Object}
 * @property {String} code
 * @property {String} map
 */
export function uglify(source, filename) {

    const {error, code, map} = minify({
        [filename]:  source
    }, {
        mangle:     {
            keep_fnames:  true
        },
        output:     {
            comments:  'some'
        },
        ie8:        true,
        sourceMap:  {
            filename,  url: `${filename}.map`
        },
        warnings:   'verbose'
    });

    if ( error )  throw error;

    return  {code, map};
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


/**
 * @param {Iterable} list
 * @param {*}        value
 *
 * @return {Boolean} Whether `list` has a same `value`
 */
export function hasItem(list, value) {

    return  Array.prototype.some.call(list,  item => {
        try {
            deepStrictEqual(item, value);  return true;

        } catch (error) {  return false;  }
    });
}


/**
 * Add values which the target object doesn't have
 *
 * @param {Object|Array}      target
 * @param {...(Object|Array)} mixin
 *
 * @return {Object|Array} The `target`
 */
export function patch(target, ...mixin) {

    mixin.forEach(source => {

        if (typeof target.length === 'number')
            Array.from(
                source,  value => hasItem(target, value) || target.push( value )
            );
        else if (typeof target === 'object') {

            for (let key in source)
                if (!(key in target))
                    target[key] = source[key];
                else if (typeof target[key] === 'object')
                    patch(target[key], source[key]);
        }
    });

    return target;
}
