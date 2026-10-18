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
    const result = new Map<Parameters<T>, ReturnType<T>>();

    return function (
        this: ThisParameterType<T>,
        ...parameter: Parameters<T>
    ): ReturnType<T> {
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
        if (typeof (target as ArrayLike<T>).length === 'number') {
            const arrayTarget = target as {
                length: number;
                [index: number]: T;
            };
            Array.from(
                source as ArrayLike<T>,
                value =>
                    hasItem(arrayTarget, value) ||
                    (arrayTarget[arrayTarget.length] = value)
            );
        } else if (typeof target === 'object') {
            const objectTarget = target as Record<string, T>;
            const objectSource = source as Record<string, T>;

            for (const key in objectSource)
                if (!(key in objectTarget))
                    objectTarget[key] = objectSource[key];
                else if (typeof objectTarget[key] === 'object')
                    patch(
                        objectTarget[key] as Patchable<T>,
                        objectSource[key] as Patchable<T>
                    );
        }
    return target;
}
