import { spawn } from '../source/console';

describe('Console', () => {
    /**
     * @test {spawn}
     */
    describe('Cross spawn', () => {
        it('Return stdout', async () => {
            expect(await spawn('node', ['-e', 'console.log("test")'])).toBe(
                'test\n'
            );
        });

        it('Return "" when stdout redirected', async () => {
            expect(
                await spawn('node', ['-e', 'console.log("test")'], {
                    stdio: 'inherit'
                })
            ).toBe('');
        });

        it('Throw an error', async () => {
            try {
                await spawn('node', ['-e', 'process.exit(1)']);
            } catch (error) {
                expect(error.code).toBe(1);
            }
        });
    });
});
