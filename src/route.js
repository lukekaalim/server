// @flow strict
/*::
import type { HTTPMethod } from './http';
import type { JSONValue } from './json';
*/

/*::
export type RouteRequest = {
  path: string,
  method: HTTPMethod,
  query: URLSearchParams,
  headers: { [string]: string },
  body?: string,
};

export type RouteResponse = {
  status: number,
  headers: { [string]: string },
  body: string,
};

export type RouteHandler = (request: RouteRequest) => Promise<RouteResponse>

export type Route = {
  method: HTTPMethod,
  path: string,
  handler: RouteHandler,
};
*/

const createRoute = (method/*: HTTPMethod*/, path/*: string*/, handler/*: RouteHandler*/)/*: Route*/ => ({
  method,
  path,
  handler,
});

/*::
type SimpleRouteConstructor = (path: string, handler: RouteHandler) => Route;
*/

const get     /*: SimpleRouteConstructor*/ = (path, handler) => createRoute('GET', path, handler);
const post    /*: SimpleRouteConstructor*/ = (path, handler) => createRoute('POST', path, handler);
const _delete /*: SimpleRouteConstructor*/ = (path, handler) => createRoute('DELETE', path, handler);
const put     /*: SimpleRouteConstructor*/ = (path, handler) => createRoute('PUT', path, handler);
const patch   /*: SimpleRouteConstructor*/ = (path, handler) => createRoute('PATCH', path, handler);
const options /*: SimpleRouteConstructor*/ = (path, handler) => createRoute('OPTIONS', path, handler);
const head    /*: SimpleRouteConstructor*/ = (path, handler) => createRoute('HEAD', path, handler);

module.exports = {
  get,
  post,
  delete: _delete,
  put,
  patch,
  options,
  head,
};
