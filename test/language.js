import { toRegExp, toES_5 } from '../source/language';


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

async function test() { }

`, null, true).should.be.equal(`

require("@babel/polyfill");

async function test() {}`.trim());
    });
});
