import {
    configOf, patternOf, currentModulePath, setNPMConfig, getNPMConfig, packageOf
} from '../source/module';

import { join } from 'path';

import { readJSONSync } from 'fs-extra';


describe('Meta information of modules',  () => {

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
    it('Get or set NPM config',  () => {

        setNPMConfig('test_example', 'sample');

        getNPMConfig('test_example').should.be.equal('sample');

        setNPMConfig('test_example', true);

        getNPMConfig('test_example').should.be.true();

        setNPMConfig('test_example', null);

        (getNPMConfig('test_example') === undefined).should.be.true();
    });
});
