// @flow strict
/*::
import type { IncomingMessage, ServerResponse } from 'http';
import type { Route, RouteHandler, RouteResponse } from './route';
*/
const { writeStream } = require('./stream');
const { statusCodes: { internalServerError, notFound }} = require('./http');
const { getRouteRequest, writeOutgoingResponse, respond } = require('./route')

/*::
export type HTTPListener = (
  request: IncomingMessage,
  response: ServerResponse, 
) => void;
*/

const createFixedListener = (routeResponse/*: RouteResponse*/)/*: HTTPListener*/ => {
  const listener = (_, res) => {
    res.writeHead(routeResponse.status, routeResponse.headers);
    writeStream(res, routeResponse.body || null);
  };
  return listener;
};
  
const createRouteListener = (
  routes/*: Route[]*/,
  fallbackListener/*: HTTPListener*/ = createFixedListener(respond(notFound)),
)/*: HTTPListener*/ => {
  const routeMap = new Map(routes.map(route => [route.method + route.path, route]));
  const listener = async (httpRequest, httpResponse) => {
    try {
      const routeRequest = getRouteRequest(httpRequest);
      const { method, path } = routeRequest;
      const route = routeMap.get(method + path);
      if (!route)
        return fallbackListener(httpRequest, httpResponse);

      try {
        const response = await route.handler(routeRequest)
        writeOutgoingResponse(httpResponse, response);
      } catch (error) {
        writeOutgoingResponse(httpResponse, respond(internalServerError))
      }
    } catch (error) {
      httpResponse.end();
    }
  };

  return (req, res) => void listener(req, res);
};

module.exports = {
  createRouteListener,
  router: createRouteListener,
  createFixedListener,
}