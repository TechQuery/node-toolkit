import {
    packageNameOf, configOf, patternOf, currentModulePath, setNPMConfig,
    getNPMConfig, packageOf
} from '../source/module';

import { join } from 'path';

import { readJSONSync } from 'fs-extra';


describe('Meta information of modules',  () => {
    /**
     * @test {packageNameOf}
     */
    it(
        'Get legal Package name',
        () => packageNameOf('@EasyWebApp/ES-pack')
            .should.be.equal('@easywebapp/es-pack')
    );

    var config;
    /**
     * @test {configOf}
     */
    it('Get configuration from "package.json"',  () => {

        process.env.NODE_ENV = 'development';

        config = configOf('test');

        config.should.be.eql({
            example:  {'^test$': 'example'}
        });
    });

    /**
     * @test {patternOf}
     */
    it(
        'Map String config to RegExp edition',
        ()  =>  patternOf( config.example ).should.be.eql({
            example:  /^test$/
        })
    );

    /**
     * @test {currentModulePath}
     */
    it(
        'Get path of current module',
        ()  =>  currentModulePath().should.match( /^(\w:)?\/.+\/test\/module\.js$/ )
    );

    /**
     * @test {packageOf}
     */
    it(
        'Get root path of this package',
        ()  =>  packageOf( currentModulePath() ).should.be.eql({
            path:  join(currentModulePath(), '../../').slice(0, -1),
            meta:  readJSONSync('./package.json')
        })
    );

    /**
     * @test {setNPMConfig}
     * @test {getNPMConfig}
     */
    describe('Get or set NPM config',  () => {

        it('String value',  () => {

            setNPMConfig('test_example', 'sample');

            getNPMConfig('test_example').should.be.equal('sample');
        });

        it('Boolean value',  () => {

            setNPMConfig('test_example', true);

            getNPMConfig('test_example').should.be.true();
        });

        it('Clean value',  () => {

            setNPMConfig('test_example', null);

            (getNPMConfig('test_example') === undefined).should.be.true();
        });
    });
});
