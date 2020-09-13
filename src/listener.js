// @flow strict
/*::
import type { HTTPIncomingRequest, HTTPOutgoingResponse } from './http';
import type { Readable, Writable } from 'stream';
import type { Route, RouteRequest, RouteResponse, RouteHandler } from './route';
*/
const { notFound, internalServerError, methodNotAllowed } = require('./responses');
const { toHttpMethod } = require('./http');

/*::
export type Listener = (
  request: HTTPIncomingRequest,
  response: HTTPOutgoingResponse, 
) => void;
*/

const readStream = (stream, length) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.setEncoding('utf8');
  stream.on('data', data => chunks.push(data));
  stream.on('error', error => reject(error));
  stream.on('end', () => resolve(chunks.join('')));
});

const getResponse = async (request, routes) => {
  try {
    const url = new URL(request.url, 'http://www.example.com');
    const path = url.pathname;
    const body = await readStream(request);
    const method = toHttpMethod(request.method);
    const headers = request.headers;
    const query = url.searchParams;

    if (!method)
      return methodNotAllowed({ message: `Unknown method: "${request.method}"` });
    const route = routes.find(route => route.method === method && route.path === path);
    if (!route)
      return notFound({ message: 'The requested Route is not valid on this server' });
  
    const response = await route.handler({ query, headers, body, path, method });
    return response;
  } catch (error) {
    console.error(error);
    return internalServerError({ message: 'Unhandled Internal Server Error' })
  }
}

const createListener = (
  routes/*: Array<Route>*/
)/*: Listener*/ => {
  const listener = async (req, res) => {
    try {
      const response = await getResponse(req, routes);
      res.writeHead(response.status, response.headers);
      res.write(response.body);
      res.end();
    } catch (error) {
      res.end();
    }
  };

  return (req, res) => void listener(req, res);
};

module.exports = {
  createListener,
}