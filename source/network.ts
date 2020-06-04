import { Readable } from 'stream';
import { Url, parse } from 'url';
import { request as requestHTTP, IncomingMessage } from 'http';

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
    URI: string | URL | Url,
    method = 'GET',
    header?: Record<string, any>,
    body?: string | Record<string, any> | Buffer
) {
    if (typeof URI === 'string') URI = parse(URI);

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
        client = (await import(URI.protocol.slice(0, -1)))
            .request as typeof requestHTTP;

    if (body instanceof Object && !(body instanceof Buffer)) {
        option.headers['Content-Type'] = 'application/json';

        body = JSON.stringify(body);
    }

    for (const key in URI)
        if (URI[key] && !(URI[key] instanceof Function)) option[key] = URI[key];

    return new Promise<IncomingMessage>((resolve, reject) =>
        client(option, resolve).on('error', reject).end(body)
    );
}
