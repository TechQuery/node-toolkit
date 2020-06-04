import { resolve, basename, dirname } from 'path';
import { readJSONSync, existsSync, readFileSync } from 'fs-extra';
import { parse } from 'yaml';
import { execSync } from 'child_process';

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

    for (const key in patternMap) return patternMap;
}

export function currentModulePath() {
    try {
        throw Error();
    } catch (error) {
        return (error as Error).stack
            ?.split(/[\r\n]+/)[2]
            .match(/at .+?\((.+):\d+:\d+\)/)[1]
            .replace(/\\/g, '/');
    }
}

export function packageOf(
    path = './'
): { path: string; meta: Record<string, any> } {
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

export function getNPMConfig(
    key: string
): string | Record<string, any> | undefined {
    const value = (execSync(`npm get ${key}`) + '').trim();

    if (value !== 'undefined')
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
}

export function setNPMConfig(key: string, value: any) {
    const data = JSON.stringify(value);

    execSync(
        value != null ? `npm set ${key} ${data}` : `npm config delete ${key}`
    );
    console.info(`${key} = ${data}`);
}
