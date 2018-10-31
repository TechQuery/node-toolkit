import { toRegExp, toES_5, cache, patch } from '../source/language';

import { spy } from 'sinon';


describe('JS language utility',  () => {
    /**
     * @test {toRegExp}
     */
    it('Create RegExp() from a literal string',  () => {

        toRegExp('/test|example\\//ig').should.be.eql( /test|example\//gi );

        toRegExp('/^test$/').should.be.eql( /^test$/ );

        toRegExp('test').should.be.eql( /test/ );
    });

    /**
     * @test {toES_5}
     */
    it('Transform ES 6+ module',  () => {

        toES_5(`
import '@babel/polyfill';

function decorator() { }

@decorator
export class Test {
    async test() { }
}
`, null, true).should.be.equal(`

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Test = void 0;

require('@babel/polyfill');

function decorator() {}

@decorator
class Test {
    async test() {}
}

exports.Test = Test;`.trim());
    });

    /**
     * @test {cache}
     */
    it('Cache function result',  () => {

        const test = spy(example => example);

        const _test_ = cache( test );

        _test_(1).should.be.equal(1);

        _test_(2).should.be.equal(2);

        _test_(1).should.be.equal(1);

        test.should.be.calledTwice();
    });

    /**
     * @test {patch}
     */
    describe('Patch data',  () => {

        it('Object',  () => {

            patch(
                {
                    test:  'string'
                },
                {
                    test:     'String',
                    example:  'text'
                }
            ).should.be.eql({
                test:     'string',
                example:  'text'
            });
        });


        it('Array',  () => {

            const object = {test: 'example'};

            patch(
                ['test', object],
                ['example', object]
            ).should.be.eql([
                'test', object, 'example'
            ]);
        });


        it('Nested object',  () => {

            const mixin = {
                test:  {
                    example:  1,
                    sample:   2
                }
            };

            patch(
                {
                    test:  {
                        example:  1
                    }
                },
                mixin
            ).should.be.eql( mixin );
        });
    });
});
