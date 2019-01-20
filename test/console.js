import { spawn } from '../source/console';


describe('Console',  () => {
    /**
     * @test {spawn}
     */
    describe('Cross spawn',  () => {
        it(
            'Return stdout',
            ()  =>  spawn('node',  ['-e', 'console.log("test")'])
                .should.be.fulfilledWith('test\n')
        );

        it(
            'Return "" when stdout redirected',
            ()  =>  spawn(
                'node',  ['-e', 'console.log("test")'],  {stdio: 'inherit'}
            ).should.be.fulfilledWith('')
        );

        it(
            'Throw an error',
            ()  =>  spawn('node',  ['-e', 'process.exit(1)'])
                .should.be.rejectedWith(Error,  {code: 1})
        );
    });
});
