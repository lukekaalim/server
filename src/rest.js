// @flow strict
/*:: import type { HTTPMethod } from './http'; */
/*:: import type { Route } from './route'; */
/*:: import type { JSONValue } from './json'; */
/*:: import type { ResourceRequest } from './resource'; */
/*:: import type { RouteResponse } from './response'; */

const { Readable } = require('stream');
const { parse } = require("./json");
const { getResourceRequest } = require('./resource');
const { json: { badRequest, unauthorized, methodNotAllowed, noContent }, responseUtil } = require('./response');
const { methods: { get, put, post, patch, delete: deleteRoute, options: createOptionsRoute, head }, methods } = require('./route');

/*::

export type RestHandler = ResourceRequest => Promise<RouteResponse>;
export type RestMethodHandlers = {|
  get?: RestHandler,
  head?: RestHandler,
  post?: RestHandler,

  put?: RestHandler,
  patch?: RestHandler,

  delete?: RestHandler,
|};

export type RestOptions = {
  allowedHeaders?: string[],
  allowedOrigins?:
    | { type: 'whitelist', origins: string[] }
    | { type: 'wildcard' },
  authorized?: bool,
  cacheSeconds?: number,
};
*/

const createRouteHandler = (handler, options) => async (request) => {
  const resourceRequest = await getResourceRequest(request);
  const response = await handler(resourceRequest);

  return {
    ...response,
    headers: {
      ...createCORSRequestHeaders(request, options),
      ...response.headers,
    }
  }
};

const isAllowedOrigin = (origin, allowedOrigins) => {
  switch (allowedOrigins.type) {
    case 'whitelist':
      return allowedOrigins.origins.includes(origin);
    case 'wildcard':
      return true;
  }
};

const createCORSRequestHeaders = (request, options) => {
  const origin = request.headers['origin'];
  const { allowedOrigins = { type: 'whitelist', origins: [] }, authorized = false } = options;

  return Object.fromEntries([
    (origin && isAllowedOrigin(origin, allowedOrigins)) ? ['Access-Control-Allow-Origin', origin] : null,
    authorized ? ['Access-Control-Allow-Credentials', 'true'] : null,
  ].filter(Boolean));
};

const createHeadHandler = (methods, options) => {
  if (!methods.get)
    return null;
  
  const handler = createRouteHandler(methods.get, options);

  return async (r) => responseUtil.head(await handler(r));
};
const createOptionsHandler = (methods, options) => {
  const { allowedHeaders = [], cacheSeconds = 0 } = options;
  const methodNames = Object.keys(methods);

  const allowedMethodsHeader = [
    ...methodNames,
    methods.get && 'head'
  ]
    .filter(Boolean)
    .map(h => h.toUpperCase())
    .join(', ');

  const allowedHeadersHeader = [
    'content-type',
    ...allowedHeaders,
  ].filter(Boolean).join(', ');

  return async (req) => {
    const headers = {
      ...createCORSRequestHeaders(req, options),
      'Allow': allowedMethodsHeader,
      'Access-Control-Allow-Methods': allowedMethodsHeader,
      'Access-Control-Allow-Headers': allowedHeadersHeader,
      'Access-Control-Max-Age': cacheSeconds.toString(),
    };
  
    return noContent('', headers);
  }
};

const resource = (path/*: string*/, methods/*: RestMethodHandlers*/, options/*: RestOptions*/ = {})/*: Route[]*/ => {
  const routes = Object.entries(methods)
    .map(([method, handler]) => {
      const routeHandler = createRouteHandler(handler, options);
      switch (method) {
        case 'get':
          return get(path, routeHandler);
        case 'post':
          return post(path, routeHandler);
        case 'put':
          return put(path, routeHandler);
        case 'patch':
          return patch(path, routeHandler);
        case 'delete':
          return deleteRoute(path, routeHandler);
        default:
          throw new TypeError();
      }
    });

  const headHandler = createHeadHandler(methods, options);
  const optionsHandler = createOptionsHandler(methods, options);

  return [
    ...routes,
    headHandler && head(path, headHandler),
    optionsHandler && createOptionsRoute(path, optionsHandler),
  ].filter(Boolean);
};

module.exports = {
  resource,
};
