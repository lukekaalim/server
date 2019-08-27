// @flow strict
/*::
import type { HTTPIncomingRequest, HTTPOutgoingResponse } from './http';
import type { Readable, Writable } from 'stream';
import type { Route } from './route';
*/

/*::
export type Listener = (
  request: HTTPIncomingRequest,
  response: HTTPOutgoingResponse, 
) => void;
*/

const DEFAULT_ROUTE_NOT_FOUND_LISTENER = (inc, res) => {
  res.writeHead(404);
  res.end();
};

const DEFAULT_ROUTE_THROW_LISTENER = (inc, res) => {
  res.writeHead(500);
  res.end();
};

const createListener = (
  routes/*: Array<Route>*/,
  onRouteNotFound/*: Listener*/ = DEFAULT_ROUTE_NOT_FOUND_LISTENER,
  onRouteThrow/*: Listener*/ = DEFAULT_ROUTE_THROW_LISTENER,
)/*: Listener*/ => {
  const listener = (inc, res) => {
    const currentRoute = routes.find(route => route.test(inc));
    if (!currentRoute) {
      onRouteNotFound(inc, res);
    } else {
      currentRoute
        .handler(inc, res)
        .catch(error => onRouteThrow(inc, res))
    }
  };
  return listener;
};

module.exports = {
  createListener,
}