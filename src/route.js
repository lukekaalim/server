// @flow strict
const url = require('url');
/*::
import type { HTTPIncomingRequest, HTTPOutgoingResponse } from './http';
*/

/*::
export type Route = {
  test: (inc: HTTPIncomingRequest) => boolean,
  handler: (inc: HTTPIncomingRequest, res: HTTPOutgoingResponse) => Promise<void>,
};
*/

const createRoute = (
  test/*: (inc: HTTPIncomingRequest) => boolean*/,
  handler/*: (inc: HTTPIncomingRequest, res: HTTPOutgoingResponse) => Promise<void>*/,
)/*: Route*/ => ({
  test,
  handler,
});

module.exports = {
  createRoute,
};