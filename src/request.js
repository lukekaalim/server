// @flow strict
/*:: import type { HTTPMethod, HTTPIncomingRequest, HTTPRequestHeaders } from './http'; */
const { toHttpMethod, toHttpRequestHeaders } = require('./http');

/*::
export type Query = { [searchParameter: string]: string };

export type RouteRequest = {
  path: string,
  method: HTTPMethod,
  query: Query,
  headers: HTTPRequestHeaders,

  stream: HTTPIncomingRequest
}
*/

const parseRequestURL = (urlFragment/*: string*/)/*: { path: string, query: Query }*/ => {
  const url = new URL(urlFragment, 'http://www.example.com');
  const path = url.pathname;
  const query = Object.fromEntries(url.searchParams);

  return {
    path,
    query
  };
}

const createRouteRequest = (request/*: HTTPIncomingRequest*/)/*: RouteRequest*/ => {
  const { path, query } = parseRequestURL(request.url);
  const method = toHttpMethod(request.method);
  const headers = toHttpRequestHeaders(request.headers);

  return {
    path,
    query,
    method,
    headers,

    stream: request,
  };
};

module.exports = {
  createRouteRequest,
};