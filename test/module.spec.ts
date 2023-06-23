import { join } from 'path';
import { readJSONSync } from 'fs-extra';
import {
    packageNameOf,
    configOf,
    patternOf,
    currentModulePath,
    setNPMConfig,
    getNPMConfig,
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
     * @test {setNPMConfig}
     * @test {getNPMConfig}
     */
    describe('Get or set NPM config', () => {
        it('String value', () => {
            setNPMConfig('test_example', 'sample');

            expect(getNPMConfig('test_example')).toBe('sample');
        });

        it('Boolean value', () => {
            setNPMConfig('test_example', true);

            expect(getNPMConfig('test_example')).toBeTruthy();
        });

        it('Clean value', () => {
            setNPMConfig('test_example', null);

            expect(getNPMConfig('test_example')).toBeUndefined();
        });
    });
});
