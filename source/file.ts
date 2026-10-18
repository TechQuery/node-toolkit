import { readdirSync, promises } from 'fs';
import { join, resolve } from 'path';
import MIME from 'mime';
import { fileTypeFromBuffer } from 'file-type';

export function findFile(name: string | RegExp, path = '.') {
    const file = readdirSync(path).find(file => file.match(name));

    if (file) return join(path, file);
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

        for (const name of file) yield join(path, name);
    }
}

export async function toDataURI(path: string) {
    const file = await promises.readFile(path);
    const type = await fileTypeFromBuffer(file);

    return `data:${type?.mime || MIME.getType(path)};base64,${file.toString(
        'base64'
    )}`;
}

const DataURI_pattern = /^data:(.+?\/(.+?))?(;base64)?,(\S+)/;
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_Types
 */
export async function blobFrom(DataURI: string) {
    const match = DataURI_pattern.exec(DataURI);

    if (!match) throw new TypeError('Invalid data URI');

    const [, MIME, extension, base64, raw] = match as string[];

    const data = Buffer.from(raw, base64 ? 'base64' : 'utf-8');

    return {
        MIME: MIME || (await fileTypeFromBuffer(data))?.mime,
        extension,
        data
    };
}
