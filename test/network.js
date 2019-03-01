import { request, readStream } from '../source/network';


var response;

describe('Network utility',  () => {
    /**
     * @test {request}
     */
    it('HTTP(S) request',  async () => {

        (await request('https://github.com')).should.be.html();

        response = await request('https://api.github.com');

        response.should.be.json();
    });

    /**
     * @test {readStream}
     */
    it(
        'Read stream',
        async ()  =>  (await readStream( response )).should.be.an.Object()
    );
});
