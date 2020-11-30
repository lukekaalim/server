// @flow strict
/*:: import type { HTTPMethod } from './http'; */
/*:: import type { Route, RouteResponse } from './route'; */
/*:: import type { JSONValue } from './json'; */

const { parse } = require("./json");
const { badRequest, unauthorized, methodNotAllowed, noContent } = require('./responses');
const { get, put, post, patch, delete: createDeleteRoute, options: createOptionsRoute, head } = require('./route');

/*::
type Authorization =
  | { type: 'unknown', value: string }
  | { type: 'none' }
  | { type: 'basic', username: string, password: string }
  | { type: 'bearer', token: string }

type Content =
  | { type: 'unknown' }
  | { type: 'none' }
  | { type: 'text', value: string }
  | { type: 'json', value: JSONValue }
  | { type: 'bad', message: string }

type SearchParameters = {
  [string]: string,
};

type ResourceRequest = {
  method: HTTPMethod,
  auth: Authorization,
  params: SearchParameters,
  content: Content,
};

export type {
  ResourceRequest,
  SearchParameters,
  Content,
  Authorization,
};
*/

/*::
type ResourceMethods = {
  create?: (req: ResourceRequest) => Promise<RouteResponse>,
  read?: (req: ResourceRequest) => Promise<RouteResponse>,
  edit?: (req: ResourceRequest) => Promise<RouteResponse>,
  destroy?: (req: ResourceRequest) => Promise<RouteResponse>,
};

type ResourceOptions = {
  allowedHeaders?: string[],
  allowedOrigins?: { type: 'whitelist', origins: string } | { type: 'wildcard' },
  authorized?: bool,
  cacheSeconds?: number,
};

export type {
  ResourceOptions,
  ResourceMethods
};
*/

const getAuthorization = (authorizationValue)/*: Authorization*/ => {
  if (!authorizationValue)
    return { type: 'none' };
  const [type, credentials] = authorizationValue.split(' ', 2);
  switch (type.toLowerCase()) {
    case 'basic': {
      const [username, password] = Buffer.from(credentials, 'base64').toString('utf8').split(':', 2);
      return { type: 'basic', username, password }
    }
    case 'bearer':
      return { type: 'bearer', token: credentials }
    default:
      return { type: 'unknown', value: authorizationValue };
  }
}

const getContent = (contentType, body)/*: Content*/ => {
  if (!body)
    return { type: 'none' };

  switch (contentType) {
    case '':
    case undefined:
      return { type: 'none' };
    case 'application/json':
      try {
        return { type: 'json', value: parse(body) };
      } catch (error) {
        return { type: 'bad', message: error.message };
      }
    case 'text/plain':
      return { type: 'text', value: body };
    default:
      return { type: 'unknown' };
  }
}

const createResourceRequest = (request) => {
  const method = request.method;
  const auth = getAuthorization(request.headers['authorization']);
  const params = Object.fromEntries(request.query);
  const content = getContent(request.headers['content-type'], request.body)

  return {
    method,
    auth,
    params,
    content,
  }
};

const createRouteHandler = (methodHandler, options) => async (request) => {
  if (!methodHandler)
    return methodNotAllowed({ message: 'This method is not allowed on this resource.' });
  
  const resourceRequest = createResourceRequest(request);
  const response = await methodHandler(resourceRequest);

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

const resource = (path/*: string*/, methods/*: ResourceMethods*/, options/*: ResourceOptions*/ = {})/*: Route[]*/ => {
  const { create, read, edit, destroy } = methods;
  const { allowedHeaders = [], cacheSeconds = 0 } = options;

  const getRoute = get(path, createRouteHandler(read, options));
  const postRoute = post(path, createRouteHandler(create, options));
  const putRoute = put(path, createRouteHandler(edit, options));
  const patchRoute = patch(path, createRouteHandler(edit, options));
  const deleteRoute = createDeleteRoute(path, createRouteHandler(destroy, options));
  const headRoute = head(path, async (req) => {
    const response = await getRoute.handler(req);
    if (response.status !== 200)
      return response;
  
    return {
      ...response,
      body: '',
      headers: {
        ...response.headers,
        'Content-Length': Buffer.from(response.body).length.toString()
      },
    };
  });
  const optionsRoute = createOptionsRoute(path, async (req) => {
    const allowedMethodsHeader = [
      read && 'GET',
      read && 'HEAD',
      create && 'POST',
      edit && 'PUT',
      edit && 'UPDATE',
      read && 'HEAD',
    ].filter(Boolean).join(', ');
    const allowedHeadersHeader = [
      'content-type',
      ...allowedHeaders,
    ].filter(Boolean).join(', ');
  
    const headers = {
      ...createCORSRequestHeaders(req, options),
      'Allow': allowedMethodsHeader,
      'Access-Control-Allow-Methods': allowedMethodsHeader,
      'Access-Control-Allow-Headers': allowedHeadersHeader,
      'Access-Control-Max-Age': cacheSeconds.toString(),
    };
    return noContent('', headers);
  });

  return [getRoute, postRoute, putRoute, patchRoute, deleteRoute, headRoute, optionsRoute].filter(Boolean);
};

module.exports = {
  resource,
};
