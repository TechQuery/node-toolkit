import { toRegExp, toES_5, cache, patch } from '../source/language';

describe('JS language utility', () => {
    /**
     * @test {toRegExp}
     */
    it('Create RegExp() from a literal string', () => {
        expect(toRegExp('/test|example\\//ig')).toEqual(/test|example\//gi);

        expect(toRegExp('/^test$/')).toEqual(/^test$/);

        expect(toRegExp('test')).toEqual(/test/);
    });

    /**
     * @test {toES_5}
     */
    it('Transform ES 6+ module', () => {
        expect(
            toES_5(
                `
import '@babel/polyfill';

function decorator() { }

@decorator
export class Test {
    async test() { }
}
`,
                null,
                true
            )
        ).toBe(
            `

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

exports.Test = Test;`.trim()
        );
    });

    /**
     * @test {cache}
     */
    it('Cache function result', () => {
        const test = jest.fn(example => example);

        const _test_ = cache(test);

        expect(_test_(1)).toBe(1);

        expect(_test_(2)).toBe(2);

        expect(_test_(1)).toBe(1);

        expect(test).toBeCalledTimes(2);
    });

    /**
     * @test {patch}
     */
    describe('Patch data', () => {
        it('Object', () => {
            expect(
                patch(
                    {
                        test: 'string'
                    },
                    {
                        test: 'String',
                        example: 'text'
                    }
                )
            ).toEqual(
                expect.objectContaining({
                    test: 'string',
                    example: 'text'
                })
            );
        });

        it('Array', () => {
            const object = { test: 'example' };

            expect(patch(['test', object], ['example', object])).toEqual(
                expect.arrayContaining(['test', object, 'example'])
            );
        });

        it('Nested object', () => {
            const mixin = {
                test: {
                    example: 1,
                    sample: 2
                }
            };
            expect(
                patch<Record<string, any>>({ test: { example: 1 } }, mixin)
            ).toEqual(expect.objectContaining(mixin));
        });
    });
});
