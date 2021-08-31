// @flow strict
/*::
import type { Readable } from 'stream';
import type { HTTPMethod, HTTPIncomingRequest, HTTPOutgoingResponse, HTTPHeaders, HTTPStatus } from './http';
import type { JSONValue } from './json';
*/
const { toMethod, statusCodes } = require('./http');
const { writeStream } = require('./stream');

/*::

export type RouteRequest = {
  path: string,
  method: HTTPMethod,
  query: URLSearchParams,
  headers: HTTPHeaders,

  incoming: HTTPIncomingRequest
}

export type RouteResponse = {
  status: HTTPStatus,
  headers: HTTPHeaders,
  body: null | Readable | Buffer | string,
};


export type RouteHandler = (request: RouteRequest) => Promise<RouteResponse> | RouteResponse;

export type Route = {
  method: HTTPMethod,
  path: string,
  handler: RouteHandler,
};
*/

const getRouteRequest = (incoming/*: HTTPIncomingRequest*/)/*: RouteRequest*/ => {
  const [path, search] = incoming.url.split('?')
  const query = new URLSearchParams('?' + search);
  const method = toMethod(incoming.method);
  const headers = incoming.headers;

  return {
    path,
    query,
    method,
    headers,

    incoming,
  };
};

const createRoute = (
  method/*: HTTPMethod*/,
  path/*: string*/,
  handler/*: RouteHandler*/
)/*: Route*/ => ({
  method,
  path,
  handler,
});

const createRouteResponse = (
  status/*: HTTPStatus*/ = statusCodes.noContent,
  headers/*: HTTPHeaders*/ = {},
  body/*: null | Readable | Buffer | string*/ = null
)/*: RouteResponse*/ => ({
  status,
  headers,
  body,
});

const writeOutgoingResponse = (outgoing/*: HTTPOutgoingResponse*/, response/*: RouteResponse*/) => {
  outgoing.writeHead(response.status, response.headers);
  writeStream(outgoing, response.body || null);
};

module.exports = {
  createRoute,
  route: createRoute,

  createRouteResponse,
  respond: createRouteResponse,

  getRouteRequest,
  writeOutgoingResponse,
};
