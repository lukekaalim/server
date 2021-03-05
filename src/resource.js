// @flow strict
/*:: import type { HTTPMethod } from './http'; */
/*:: import type { Route, RouteHandler } from './route'; */

/*:: import type { CacheOptions } from './cache'; */
/*:: import type { Content } from './content'; */
/*:: import type { Authorization } from './authorization'; */
/*:: import type { AccessOptions } from './access'; */
const { createRoute } = require('./route');

const { getAuthorization } = require('./authorization');
const { getContent } = require('./content');

const { createCacheHeaders } = require('./cache');
const { createAccessHeaders } = require('./access');
const { statusCodes, toMethod } = require('./http');

/*
A HTTP _resource_ is a collection of routes than handle various methods for a single path.
It abstracts over certain headers, like content-type and content-length and authorization.
*/
/*::
export type HTTPResource = {
  methods: { [method: HTTPMethod]: RouteHandler },
  path: string,
  access?: AccessOptions,
  cache?: CacheOptions,
};
*/

const createHTTPResourceRoutes = (resource/*: HTTPResource*/)/*: Route[]*/ => {
  const defaultMethods/*: { [method: HTTPMethod]: RouteHandler }*/ = {
    OPTIONS: (request) => ({ status: statusCodes.ok, body: null, headers: {} }),
  };
  const createRouteHandler = (method) => async (request) => {
    const response = await allMethods[method](request);
    return {
      ...response,
      headers: {
        ...createCacheHeaders(resource.cache),
        ...createAccessHeaders(request.headers, resource.access),
        ...response.headers,
      }
    };
  };
  const allMethods = { ...defaultMethods, ...resource.methods };
  return Object
    .keys(allMethods)
    .map(toMethod)
    .map((method) => createRoute(method, resource.path, createRouteHandler(method)))
};

module.exports = {
  resource: createHTTPResourceRoutes,
  createHTTPResourceRoutes,
};
