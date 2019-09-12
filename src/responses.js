// @flow strict
/*::
import type { Route, RouteRequest, RouteResponse } from './route';
*/
const createRESTResponse = (
  status/*: number*/,
  body/*: string*/ = '',
  headers/*: { [header: string]: string }*/ = {},
) => ({
  status,
  headers,
  body,
});

/*::
type SimpleResponseConstructor = (
  body?: string,
  headers?: { [header: string]: string }
) => RouteResponse
*/

const                   ok/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(200, body, headers);
const           badRequest/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(400, body, headers);
const         unauthorized/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(401, body, headers);
const             notFound/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(404, body, headers);
const  internalServerError/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(500, body, headers);
const   serviceUnavailable/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(503, body, headers);

module.exports = {
  ok,
  notFound,
  badRequest,
  unauthorized,
  serviceUnavailable,
  internalServerError,
}