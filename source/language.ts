import { deepStrictEqual } from 'assert';

export function toRegExp(raw: string) {
    const [source, flag] =
        raw.match(/^\/?(.+?)(?:\/([a-z]+)?)?$/)?.slice(1) || [];

    if (source) return new RegExp(source, flag);
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

export const hasItem = <T>(list: ArrayLike<T>, value: T) =>
    Array.from(list).some(item => {
        try {
            deepStrictEqual(item, value);
            return true;
        } catch {
            return false;
        }
    });
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
