import { request } from '../source/network';


describe('Network utility',  () => {
    /**
     * @test {request}
     */
    it('HTTP(S) request',  async () => {

        (await request('https://github.com')).should.be.html();

        (await request('https://api.github.com')).should.be.json();
    });
});
