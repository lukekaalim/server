// @flow strict
/*::
import type { HTTPMethod, HTTPIncomingRequest } from './http';
import type { JSONValue } from './json';
import type { RouteRequest } from './request';
import type { RouteResponse } from './response';
*/

/*::
export type RouteHandler = (request: RouteRequest) => Promise<RouteResponse>

export type Route = {
  method: HTTPMethod,
  path: string,
  handler: RouteHandler,
};
*/

const methodNames/*: { [string]: HTTPMethod }*/ = {
  get: 'GET',
  post: 'POST',
  delete: 'DELETE',
  put: 'PUT',
  patch: 'PATCH',
  options: 'OPTIONS',
  head: 'HEAD',
};

const createRoute = (method/*: HTTPMethod*/, path/*: string*/, handler/*: RouteHandler*/)/*: Route*/ => ({
  method,
  path,
  handler,
});

/*::
type RouteMethods = {
  [$Keys<typeof methodNames>]: (path: string, handler: RouteHandler) => Route, 
};
*/

const methods/*: RouteMethods*/ = Object.fromEntries(
  Object.entries(methodNames)
    .map(([name, method]) => [
      name,
      (path, handler) => createRoute(method, path, handler)
    ]));

module.exports = {
  methods,
};
