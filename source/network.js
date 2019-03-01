import { parse } from 'url';


/**
 * HTTP(S) request
 *
 * @param {string|URL}           URL
 * @param {string}               [method='GET']
 * @param {Object}               [header]
 * @param {string|Object|Buffer} [body]
 *
 * @return {IncomingMessage} HTTP(S) response
 */
export  async function request(URL,  method = 'GET',  header,  body) {

    if (typeof URL === 'string')  URL = parse( URL );

    const option = {
            method,
            headers:  Object.assign({
                Accept:        '*/*',
                'User-Agent':  `Node.JS ${process.version}`
            }, header)
        },
        client = (await import( URL.protocol.slice(0, -1) )).request;

    if ((body instanceof Object)  &&  !(body instanceof Buffer)) {

        option.headers['Content-Type'] = 'application/json';

        body = JSON.stringify( body );
    }

    for (let key in URL)
        if (URL[ key ]  &&  !(URL[key] instanceof Function))
            option[key] = URL[key];

    return  await new Promise((resolve, reject) =>
        client(option, resolve).on('error', reject).end( body )
    );
}


/**
 * @param {Readable} source
 *
 * @return {String|Object}
 */
export async function readStream(source) {

    var data = '';

    source.on('data',  chunk => (data += chunk));

    await  new Promise((resolve, reject) => {

        source.on('end',  () => resolve( data ));

        source.on('error', reject);
    });

    try {
        return JSON.parse( data );

    } catch (error) {

        return data;
    }
}
