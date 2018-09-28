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

function decorator() { }

@decorator
export class Test {
    async test() { }
}
`, null, true).should.be.equal(`

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Test = void 0;

require("@babel/polyfill");

function decorator() {}

@decorator
class Test {
  async test() {}

}

exports.Test = Test;`.trim());
    });
});
