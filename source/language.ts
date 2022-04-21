import { TransformOptions, transform } from '@babel/core';
import { format } from 'prettier';
import { minify } from 'uglify-js';
import { deepStrictEqual } from 'assert';

/**
 * generate a Number with 36 radix
 */
export function uniqueID() {
    return Number((Math.random() + '').slice(2)).toString(36);
}

export function toRegExp(raw: string) {
    const [source, flag] =
        raw.match(/^\/?(.+?)(?:\/([a-z]+)?)?$/)?.slice(1) || [];

    if (source) return new RegExp(source, flag);
}

export function prettify(source: string) {
    return format(source, {
        parser: 'babel',
        singleQuote: true,
        trailingComma: 'none',
        arrowParens: 'avoid',
        tabWidth: 4
    }).trim();
}

/**
 * @param code       ES 6+ source code
 * @param fileName   Full name of this JS file
 * @param onlyModule Only transform ES 6 module to CommonJS
 *
 * @return ES 5 source code
 */
export function toES_5(code: string, fileName?: string, onlyModule?: boolean) {
    const option: TransformOptions = {
        ...(onlyModule ? null : { presets: ['@babel/preset-env'] }),
        plugins: ['@babel/plugin-transform-modules-commonjs'],
        ast: false,
        filename: fileName || undefined,
        babelrc: !onlyModule,
        parserOpts: {
            plugins: [
                'optionalCatchBinding',
                'objectRestSpread',
                'asyncGenerators',
                'classProperties',
                ['decorators', { decoratorsBeforeExport: true }],
                'importMeta',
                'dynamicImport',
                'exportDefaultFrom',
                'exportNamespaceFrom'
            ]
        }
    };
    return prettify(
        transform(code, option).code.replace(
            /^(?:'|")use strict(?:'|");\n+/,
            ''
        )
    );
}

export function uglify(source: string, fileName: string) {
    const { error, code, map } = minify(
        {
            [fileName]: source
        },
        {
            mangle: {
                keep_fnames: true
            },
            output: {
                comments: 'some'
            },
            ie8: true,
            sourceMap: {
                filename: fileName,
                url: `${fileName}.map`
            },
            warnings: 'verbose'
        }
    );
    if (error) throw error;

    return { code, map };
}

/**
 * wrap Function with result cache
 */
export function cache<T extends (...data: any[]) => any>(func: T) {
    const result = new Map();

    return function (...parameter) {
        for (const [input, output] of result)
            try {
                deepStrictEqual(input, parameter);
                return output;
            } catch {
                //
            }
        const output = func.apply(this, parameter);

        result.set(parameter, output);

        return output;
    } as T;
}

export function hasItem<T>(list: ArrayLike<T>, value: T) {
    return Array.from(list).some(item => {
        try {
            deepStrictEqual(item, value);
            return true;
        } catch {
            return false;
        }
    });
}

export type Patchable<T> = Record<string, T> | ArrayLike<T>;

/**
 * Add values which the target object doesn't have
 */
export function patch<T>(target: Patchable<T>, ...mixin: Patchable<T>[]) {
    for (const source of mixin)
        if (typeof target.length === 'number')
            Array.from(
                source as ArrayLike<T>,
                value =>
                    hasItem(target as ArrayLike<T>, value) ||
                    (target[target.length as number] = value)
            );
        else if (typeof target === 'object') {
            for (const key in source)
                if (!(key in target)) target[key] = source[key];
                else if (typeof target[key] === 'object')
                    patch(target[key], source[key]);
        }
    return target;
}
