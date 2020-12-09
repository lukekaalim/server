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
 | 'HEAD'
 | 'OPTIONS'
 | 'PATCH';

export type HTTPRequestHeaders = {
  [string]: ?string,
};
export type HTTPResponseHeaders = {
  [string]: string,
};

export type HTTPIncomingRequest = Readable & {
  headers: HTTPRequestHeaders,
  url: string,
  method: string
};

export type HTTPOutgoingResponse = Writable & $ReadOnly<{
  writeHead: (status: number, headers?: HTTPResponseHeaders) => void,
}>;
*/

const toHttpMethod = (methodName/*: string*/)/*: HTTPMethod*/ => {
  const upperCaseMethodName = methodName.toUpperCase();
  switch (upperCaseMethodName) {
    case 'GET':
    case 'POST':
    case 'DELETE':
    case 'PUT':
    case 'HEAD':
    case 'OPTIONS':
    case 'PATCH':
      return upperCaseMethodName;
    default:
      throw new TypeError(`"${methodName}" is not an acceptable HTTP method`)
  }
};

module.exports = {
  toHttpMethod,
};
