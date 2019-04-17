import { currentModulePath } from '../source/module';

import { findUp, toDataURI, blobFrom } from '../source/file';

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
     * @test {blobFrom}
     */
    it('Encode & Decode of Data URI',  () => {

        const URI = toDataURI('./package.json'),
            data = readFileSync('./package.json');

        URI.should.be.equal(
            `data:application/json;base64,${ data.toString('base64') }`
        );

        blobFrom( URI ).should.be.eql({
            MIME:       'application/json',
            extension:  'json',
            data
        });
    });
});
