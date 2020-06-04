import { createReadStream } from 'fs';
import { readStream, request } from '../source/network';

describe('Network utility', () => {
    /**
     * @test {readStream}
     */
    it('Read stream', async () => {
        expect(
            typeof (await readStream(createReadStream('package.json'))) ===
                'object'
        ).toBeTruthy();
    });
    // /**
    //  * @test {request}
    //  */
    // it('HTTP(S) request', async () => {
    //     expect(await readStream(await request('https://github.com'))).toMatch(
    //         /<\w+>/
    //     );
    //     expect(
    //         typeof (await readStream(
    //             await request('https://api.github.com')
    //         )) === 'object'
    //     ).toBeTruthy();
    // });
});
