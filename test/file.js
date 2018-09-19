import { currentModulePath } from '../source/module';

import { findUp, toDataURI } from '../source/file';

import { basename, dirname, join } from 'path';

import { readFileSync } from 'fs';


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

    /**
     * @test {toDataURI}
     */
    it(
        'Convert a file to Data URI',
        ()  =>  toDataURI('./package.json').should.be.equal(
            `data:application/json;base64,${
                readFileSync('./package.json').toString('base64')
            }`
        )
    );
});
