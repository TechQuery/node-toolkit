import { findUp } from '../source/file';

import { currentModulePath } from '../source/module';

import { basename, dirname, join } from 'path';


describe('File system',  () => {
    /**
     * @test {findUp}
     */
    it('Find files upward',  () => {

        const current = currentModulePath();

        for (var file  of  findUp( current ))
            if (basename( file )  ===  'package.json')  break;

        dirname( join(current, '../') ).should.be.equal( dirname( file ) );
    });
});
