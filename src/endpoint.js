// @flow strict
/*:: import type { JSONValue } from '@lukekaalim/cast'; */ 
/*:: import type { RouteHandler } from './route'; */ 
/*:: import type { HTTPStatus, HTTPHeaders } from './http'; */ 
/*:: import type { GETEndpoint, POSTEndpoint, DELETEEndpoint, PUTEndpoint } from '@lukekaalim/api-models'; */ 
const { readJSONBody, getContent } = require('./content');
const { application } = require('./responses');

/*::
export type EndpointRequest<Q, R> = {| query: Q, body: R, headers: HTTPHeaders |};
export type EndpointResponse<R> = {| status: HTTPStatus, body: R, headers?: HTTPHeaders |};
*/

const createGETHandler = /*:: <R: JSONValue, Q: ?{ +[string]: ?string }>*/(
  endpoint/*: GETEndpoint<R, Q>*/,
  endpointHandler/*: (request: EndpointRequest<Q, null>) => Promise<EndpointResponse<R>> | EndpointResponse<R>*/
)/*: RouteHandler*/ => {
  const routeHandler = async (request) => {
    const query = endpoint.toQuery(Object.fromEntries(request.query));
    const endpointRequest = { query, body: null, headers: request.headers };
    const endpointResponse = await endpointHandler(endpointRequest);
    return application.json(endpointResponse.status, endpointResponse.body, endpointResponse.headers);
  };
  return routeHandler;
};

const createPOSTHandler = /*:: <Req: JSONValue, Res: JSONValue, Q: ?{ +[string]: ?string }>*/(
  endpoint/*: POSTEndpoint<Req, Res, Q>*/,
  endpointHandler/*: (request: EndpointRequest<Q, Req>) => Promise<EndpointResponse<Res>> | EndpointResponse<Res>*/
)/*: RouteHandler*/ => {
  const routeHandler = async (request) => {
    const query = endpoint.toQuery(Object.fromEntries(request.query));
    const requestBodyValue = endpoint.toRequestBody(await readJSONBody(request.incoming, request.headers));
    const endpointRequest = { query, body: requestBodyValue, headers: request.headers };
    const endpointResponse = await endpointHandler(endpointRequest);
    return application.json(endpointResponse.status, endpointResponse.body, endpointResponse.headers );
  };
  return routeHandler;
}

const createPUTHandler = /*:: <Req: JSONValue, Q: ?{ +[string]: ?string }>*/(
  endpoint/*: PUTEndpoint<Req, Q>*/,
  endpointHandler/*: (request: EndpointRequest<Q, Req>) => Promise<EndpointResponse<null>> | EndpointResponse<null>*/
)/*: RouteHandler*/ => {
  const routeHandler = async (request) => {
    const query = endpoint.toQuery(Object.fromEntries(request.query));
    const requestBodyValue = endpoint.toRequestBody(await readJSONBody(request.incoming, request.headers));
    const endpointRequest = { query, body: requestBodyValue, headers: request.headers };
    const endpointResponse = await endpointHandler(endpointRequest);
    return application.json(endpointResponse.status, endpointResponse.body, endpointResponse.headers );
  };
  return routeHandler;
}

const createDELETEHandler = /*:: <Req: JSONValue, Res: JSONValue, Q: ?{ +[string]: ?string }>*/(
  endpoint/*: DELETEEndpoint<Req, Res, Q>*/,
  endpointHandler/*: (request: EndpointRequest<Q, Req>) => Promise<EndpointResponse<Res>> | EndpointResponse<Res>*/
)/*: RouteHandler*/ => {
  const routeHandler = async (request) => {
    const query = endpoint.toQuery(Object.fromEntries(request.query));
    const requestBodyValue = endpoint.toRequestBody(await readJSONBody(request.incoming, request.headers));
    const endpointRequest = { query, body: requestBodyValue, headers: request.headers };
    const endpointResponse = await endpointHandler(endpointRequest);
    return application.json(endpointResponse.status, endpointResponse.body, endpointResponse.headers );
  };
  return routeHandler;
}

module.exports = {
  createGETHandler,
  createPOSTHandler,
  createPUTHandler,
  createDELETEHandler,
}