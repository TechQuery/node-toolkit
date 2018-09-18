import { join, resolve } from 'path';

import { readdirSync } from 'fs';


/**
 * Find files upward
 *
 * @param {String} [from='./'] - Find up from a path
 *
 * @yield {String} Full file name
 */
export function* findUp(from = './') {

    from = resolve( from );

    while ( true ) {

        let path = join(from, '../');

        if (path === from)  break;

        for (let file  of  readdirSync(from = path))
            yield  join(path, file);
    }
}
