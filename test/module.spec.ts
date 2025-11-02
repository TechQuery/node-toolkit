import { join } from 'path';
import { readJSONSync } from 'fs-extra';
import {
    packageNameOf,
    configOf,
    patternOf,
    currentModulePath,
    stringifyEnv,
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

    let config;
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
        expect(currentModulePath()).toMatch(
            /^(\w:)?\/.+\/test\/module\.spec\.ts$/
        );
    });

    /**
     * @test {packageOf}
     */
    it('Get root path of this package', () => {
        const path = currentModulePath();

        expect(packageOf(path)).toEqual(
            expect.objectContaining({
                path: join(path, '../../').slice(0, -1),
                meta: readJSONSync('./package.json')
            })
        );
    });

    if (parseFloat(process.versions.node) >= 16) return;
    /**
     * @test {stringifyEnv}
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
    });
});
