// @flow strict
/*::
import type { Readable, Writable } from 'stream';
*/

/*::
export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD'
*/
const methodNames = {
  get:      'GET',
  post:     'POST',
  delete:   'DELETE',
  put:      'PUT',
  patch:    'PATCH',
  options:  'OPTIONS',
  head:     'HEAD',
};

const toMethod = (value/*: string*/)/*: HTTPMethod*/ => {
  switch (value) {
    case 'GET':
    case 'POST':
    case 'DELETE':
    case 'PUT':
    case 'PATCH':
    case 'OPTIONS':
    case 'HEAD':
      return value;
    default:
      throw new Error('Method provided does not match known methods');
  }
};

/*::
export type HTTPStatus =
  | 200
  | 201
  | 204
  | 304
  | 400
  | 401
  | 403
  | 404
  | 405
  | 500
*/
const statusCodes = {
  ok: 200,
  created: 201,
  noContent: 204,
  notModifier: 304,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  internalServerError: 500,
};
const toStatusCode = (value/*: number*/)/*: HTTPStatus*/ => {
  switch (value) {
    case 200:
    case 201:
    case 204:
    case 400:
    case 401:
    case 403:
    case 404:
    case 500:
      return value;
    default:
      throw new Error('Status Code provided does not match known methods');
  }
}

/*::
export type HTTPHeaders = {
  [string]: string,
};

export type HTTPIncomingRequest = Readable & {
  headers: HTTPHeaders,
  url: string,
  method: string
};

export type HTTPOutgoingResponse = Writable & $ReadOnly<{
  writeHead: (status: number, headers?: HTTPHeaders) => void,
}>;
*/

module.exports = {
  methodNames,
  statusCodes,
  toMethod,
  toStatusCode,
};
