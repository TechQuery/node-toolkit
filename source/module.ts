import { resolve, basename, dirname } from 'path';
import {
    readJSONSync,
    existsSync,
    readFileSync,
    outputFile,
    ensureFile
} from 'fs-extra';
import { parseEnv } from 'util';
import { parse } from 'yaml';

import { toRegExp } from './language';
import { findUp } from './file';

export function packageNameOf(path: string) {
    const list = resolve(path).split(/[/\\]+/);

    path = list.slice(list.slice(-2)[0].startsWith('@') ? -2 : -1).join('/');

    return path.toLowerCase().replace(/[^@/\w]+/g, '-');
}

/**
 * @param map - Key for RegExp source, value for replacement
 *
 * @return Key for replacement, value for RegExp
 */
export function patternOf(map: Record<string, string>) {
    const patternMap: Record<string, RegExp> = {};

    for (const pattern in map) patternMap[map[pattern]] = toRegExp(pattern);

    for (const _key in patternMap) return patternMap;
}

export function currentModulePath() {
    try {
        throw Error();
    } catch (error) {
        return (error as Error).stack
            ?.split(/[\r\n]+/)[2]
            ?.match(/at (.+?\()?(.+):\d+:\d+\)?$/)?.[2]
            ?.replace(/\\/g, '/');
    }
}

export function packageOf(path = './'): {
    path: string;
    meta: Record<string, any>;
} {
    for (const file of findUp(path))
        if (basename(file) === 'package.json')
            return {
                path: dirname(file),
                meta: readJSONSync(file)
            };
}

/**
 * Get configuration of a Package from
 * `package.json`, `.${name}.json` or `.${name}.yml` in `process.cwd()`
 *
 * (`process.env.NODE_ENV` will affect the result)
 */
export function configOf(name: string): Record<string, any> {
    let config = packageOf('./test')?.meta?.[name];

    if (!config)
        for (const type of ['json', 'yaml', 'yml'])
            if (existsSync((name = `./.${name}.${type}`))) {
                switch (type) {
                    case 'json':
                        config = readJSONSync(name);
                        break;
                    case 'yaml':
                    case 'yml':
                        config = parse(readFileSync(name) + '');
                }
                break;
            }

    return config?.env?.[process.env.NODE_ENV] || config;
}

export const stringifyEnv = (data: Record<string, unknown>) =>
    Object.entries(data)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join('\n');

export async function saveEnv(
    newData: Record<string, unknown>,
    filePath: string
) {
    await ensureFile(filePath);

    const oldData = parseEnv(readFileSync(filePath) + '');
    newData = { ...oldData, ...newData };

    await outputFile(filePath, stringifyEnv(newData));

    return newData;
}
