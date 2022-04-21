import { readdirSync, promises } from 'fs';
import { join, resolve } from 'path';
import { getType } from 'mime';
import { fromBuffer } from 'file-type';

export function findFile(name: string | RegExp, path = '.') {
    name = readdirSync(path).find(file => file.match(name));

    if (name) return join(path, name);
}

/**
 * Find files upward
 */
export function* findUp(from = './') {
    from = resolve(from);

    while (true) {
        const path = join(from, '../');

        if (path === from) break;

        const file = readdirSync((from = path));

        while (file[0]) yield join(path, file.shift());
    }
}

export async function toDataURI(path: string) {
    const file = await promises.readFile(path);
    const type = await fromBuffer(file);

    return `data:${type?.mime || getType(path)};base64,${file.toString(
        'base64'
    )}`;
}

const DataURI_pattern = /^data:(.+?\/(.+?))?(;base64)?,(\S+)/;
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_Types
 */
export async function blobFrom(DataURI: string) {
    const [MIME, extension, base64, raw] = (
        DataURI_pattern.exec(DataURI) || []
    ).slice(1) as string[];

    const data = Buffer.from(raw, base64 ? 'base64' : 'utf-8');

    return {
        MIME: MIME || (await fromBuffer(data))?.mime,
        extension,
        data
    };
}
