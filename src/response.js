// @flow strict
/*::
import type { Route } from './route';
import type { HTTPResponseHeaders } from './http';
import type { JSONValue } from './json';
*/
const { stringify } = require('./json');
const { Readable } = require("stream")

/*::
export type RouteResponse = {
  status: number,
  headers: HTTPResponseHeaders,
  body: Readable,
};
*/

const statusNames = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 406,
  internalServerError: 500,
  serviceUnavailable: 503,
};

const createJSONResponse = (
  status/*: number*/,
  value/*: JSONValue*/ = null,
  headers/*: HTTPResponseHeaders*/ = {},
) => {
  const content = stringify(value);
  const contentLength = Buffer.from(content).length;
  // $FlowFixMe
  const body = Readable.from(content);

  return {
    status,
    body,
    headers: {
      ...headers,
      'content-length': contentLength.toString(),
      'content-type': 'application/json'
    }
  }
};

/*::
type JSONResponses = {
  [$Keys<typeof statusNames>]: (value?: JSONValue, headers?: HTTPResponseHeaders) => RouteResponse, 
};
*/

const json/*: JSONResponses*/ = Object.fromEntries(
  Object.entries(statusNames)
    .map(([name, status]) => [
      name,
      (value, header) => createJSONResponse(status, value, header)
    ]));

const head = (response/*: RouteResponse*/)/*: RouteResponse*/ => {
  return {
    ...response,
    // $FlowFixMe
    stream: Readable.from([]),
  };
};
const responseUtil = {
  head,
}

module.exports = {
  json,
  responseUtil,
};