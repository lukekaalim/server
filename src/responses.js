// @flow strict
/*::
import type { Route, RouteRequest, RouteResponse } from './route';
import type { JSONValue } from './json';
*/
const { stringify } = require('./json');

const createRESTResponse = (
  status/*: number*/,
  body/*: JSONValue*/ = '',
  headers/*: { [header: string]: string }*/ = {},
) => {
  const bodyString = stringify(body);
  const bodyStringLength = Buffer.from(bodyString).length;
  return {
    status,
    headers: {
      'Content-Length': bodyStringLength,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: bodyString,
  }
};

/*::
type SimpleResponseConstructor = (
  body?: JSONValue,
  headers?: { [header: string]: string }
) => RouteResponse
*/

const                   ok/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(200, body, headers);
const              created/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(201, body, headers);
const            noContent/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(204, body, headers);
const           badRequest/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(400, body, headers);
const         unauthorized/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(401, body, headers);
const             notFound/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(404, body, headers);
const     methodNotAllowed/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(406, body, headers);
const  internalServerError/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(500, body, headers);
const   serviceUnavailable/*: SimpleResponseConstructor*/ = (body, headers) => createRESTResponse(503, body, headers);

module.exports = {
  ok,
  noContent,
  notFound,
  created,
  methodNotAllowed,
  badRequest,
  unauthorized,
  serviceUnavailable,
  internalServerError,
}