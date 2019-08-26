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

const createListener = (
  routes/*: Array<Route>*/,
)/*: Listener*/ => {
  const listener = (req, res) => {
    const currentRoute = routes.find(route => route.test(req));
    if (!currentRoute) {
      res.writeHead(404);
      res.end();
    } else {
      currentRoute.handler(req, res);
    }
  };
  return listener;
};

module.exports = {
  createListener,
}