// @flow strict
/*::
import type { HTTPIncomingRequest, HTTPOutgoingResponse } from './http';
import type { Readable, Writable } from 'stream';
import type { Route, RouteHandler } from './route';
import type { RouteRequest } from './request';
import type { RouteResponse } from './response';
*/
const { json: { notFound, internalServerError, methodNotAllowed } } = require('./response');
const { toHttpMethod } = require('./http');
const { createRouteRequest } = require('./request');

/*::
export type Listener = (
  request: HTTPIncomingRequest,
  response: HTTPOutgoingResponse, 
) => void;
*/

const getResponse = async (request, routes) => {
  try {
    const routeRequest = createRouteRequest(request);
    const { method, path } = routeRequest;
    
    const route = routes.find(route => route.method === method && route.path === path);
    
    if (!route)
      return notFound({ message: 'The requested Route is not valid on this server' });
  
    return await route.handler(routeRequest);
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
      response.body.pipe(res);
    } catch (error) {
      res.end();
    }
  };

  return (req, res) => void listener(req, res);
};

module.exports = {
  createListener,
}