import { describe, it } from 'node:test';
import { expect } from 'expect';

import { join } from 'path';
import { outputFile, readFile, readJSON } from 'fs-extra';
import {
    packageNameOf,
    configOf,
    patternOf,
    currentModulePath,
    stringifyEnv,
    saveEnv,
    packageOf
} from '../source/module';

describe('Meta information of modules', () => {
    /**
     * @test {packageNameOf}
     */
    it('Get legal Package name', () => {
        expect(packageNameOf('@EasyWebApp/ES-pack')).toBe(
            '@easywebapp/es-pack'
        );
    });

    let config: ReturnType<typeof configOf> = {};
    /**
     * @test {configOf}
     */
    it('Get configuration from "package.json"', () => {
        process.env.NODE_ENV = 'development';

        config = configOf('test');

        expect(config).toEqual(
            expect.objectContaining({
                example: { '^test$': 'example' }
            })
        );
    });

    /**
     * @test {patternOf}
     */
    it('Map String config to RegExp edition', () => {
        expect(patternOf(config.example)).toEqual(
            expect.objectContaining({
                example: /^test$/
            })
        );
    });

    /**
     * @test {currentModulePath}
     */
    it('Get path of current module', () => {
        const path = currentModulePath();

        if (!path) throw new Error('Could not determine current module path');

        expect(path).toMatch(/^(\w:)?\/.+\/test\/module\.spec\.ts$/);
    });

    /**
     * @test {packageOf}
     */
    it('Get root path of this package', async () => {
        const path = currentModulePath();

        if (!path) throw new Error('Could not determine current module path');

        const expectedData = {
            path: join(path, '../../').slice(0, -1),
            meta: await readJSON('./package.json')
        };
        expect(packageOf(path)).toEqual(expect.objectContaining(expectedData));
    });

    if (parseFloat(process.versions.node) >= 16) return;
    /**
     * @test {stringifyEnv}
     * @test {saveEnv}
     */
    describe('Dot Env files', () => {
        it('should stringify an Object to a `.env` String', () => {
            const data = {
                test_example: 'sample',
                nested: { key: 'value' }
            };
            const result = stringifyEnv(data);

            expect(result).toBe(`test_example="sample"
nested=${JSON.stringify({ key: 'value' })}`);
        });

        it('should update existing keys in a `.env` file', async () => {
            await outputFile(
                '.env.test',
                `TEST_KEY="old_value"
ANOTHER_KEY=123`
            );
            const data = { TEST_KEY: 'new_value', NEW_KEY: 'added_value' };

            await saveEnv(data, '.env.test');

            const content = (await readFile('.env.test')) + '';

            expect(content).toBe(`TEST_KEY="new_value"
ANOTHER_KEY=123
NEW_KEY="added_value"`);
        });
    });
});
