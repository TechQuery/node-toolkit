import { describe, it } from 'node:test';
import { expect } from 'expect';

import { basename, dirname, join } from 'path';
import { readFileSync } from 'fs';

import { currentModulePath } from '../source/module';
import { findUp, toDataURI, blobFrom } from '../source/file';

describe('File system', () => {
    /**
     * @test {findUp}
     */
    it('Find files upward', () => {
        const current = currentModulePath();

        if (!current)
            throw new Error('Could not determine current module path');

        let packageFile: string | undefined;

        for (const file of findUp(current))
            if (basename(file) === 'package.json') {
                packageFile = file;
                break;
            }
        if (!packageFile) throw new Error('Could not find package.json');

        expect(dirname(join(current, '../'))).toBe(dirname(packageFile));
    });

    /**
     * @test {toDataURI}
     * @test {blobFrom}
     */
    it('Encode & Decode of Data URI', async () => {
        const URI = await toDataURI('./package.json'),
            data = readFileSync('./package.json');

        expect(URI).toBe(
            `data:application/json;base64,${data.toString('base64')}`
        );

        expect(await blobFrom(URI)).toEqual(
            expect.objectContaining({
                MIME: 'application/json',
                extension: 'json',
                data
            })
        );
    });
});
