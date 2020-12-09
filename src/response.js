// @flow strict
/*::
import type { Route } from './route';
import type { HTTPResponseHeaders } from './http';
import type { JSONValue } from './json';
*/
const { stringify } = require('./json');
const { Readable } = require("stream")

const filterHeaders = (headers)/*: HTTPResponseHeaders*/ => {
  return Object.fromEntries(
    Object.entries(headers)
      .map(([name, value]) => value ? [name, value] : null)
      .filter(Boolean)
  );
}

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
  methodNotAllowed: 405,
  notAcceptable: 406,
  internalServerError: 500,
  serviceUnavailable: 503,
};

const createJSONResponse = (
  status/*: number*/,
  value/*: JSONValue*/ = null,
  headers/*: { +[string]: ?string }*/ = {},
)/*: RouteResponse*/ => {
  const content = stringify(value);
  const contentLength = Buffer.from(content).length;
  // $FlowFixMe
  const body = Readable.from(content);

  return {
    status,
    body,
    headers: {
      ...filterHeaders(headers),
      'content-length': contentLength.toString(),
      'content-type': 'application/json'
    }
  }
};
const createStreamResponse = (
  status/*: number*/,
  body/*: Readable*/,
  headers/*: { +[string]: ?string }*/ = {}
)/*: RouteResponse*/ => {
  return {
    status,
    body,
    headers: filterHeaders(headers),
  };
};

/*::
type JSONResponses = {
  +[$Keys<typeof statusNames>]: (value?: JSONValue, headers?: { +[string]: ?string }) => RouteResponse, 
};
type StreamResponses = {
  +[$Keys<typeof statusNames>]: (body: Readable, headers?: { +[string]: ?string }) => RouteResponse, 
}
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
const stream/*: StreamResponses*/ = Object.fromEntries(
  Object.entries(statusNames)
    .map(([name, status]) => [
      name,
      (value, header) => createStreamResponse(status, value, header)
    ]));

module.exports = {
  createJSONResponse,
  createStreamResponse,
  stream,
  json,
  responseUtil,
};