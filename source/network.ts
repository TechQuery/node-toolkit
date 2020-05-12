import { Readable } from 'stream';
import { Url, parse } from 'url';
import { IncomingMessage } from 'http';

export async function readStream(
    source: Readable
): Promise<string | Record<string, any>> {
    let data = '';

    for await (const chunk of source) data += chunk;

    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
}

/**
 * HTTP(S) request
 */
export async function request(
    URL: string | URL | Url,
    method = 'GET',
    header?: Record<string, any>,
    body?: string | Record<string, any> | Buffer
) {
    if (typeof URL === 'string') URL = parse(URL);

    const option = {
            method,
            headers: Object.assign(
                {
                    Accept: '*/*',
                    'User-Agent': `Node.JS ${process.version}`
                },
                header
            )
        },
        client = (await import(URL.protocol.slice(0, -1))).request;

    if (body instanceof Object && !(body instanceof Buffer)) {
        option.headers['Content-Type'] = 'application/json';

        body = JSON.stringify(body);
    }

    for (const key in URL)
        if (URL[key] && !(URL[key] instanceof Function)) option[key] = URL[key];

    return readStream(
        await new Promise<IncomingMessage>((resolve, reject) =>
            client(option, resolve).on('error', reject).end(body)
        )
    );
}
