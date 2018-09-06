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
