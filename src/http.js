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

export type HTTPServerHeaders = {
  'Content-Type'?: 'application/json' | 'text/plain',
  'Content-Length'?: number,
};

export type HTTPIncomingRequest = Readable & {
  headers: { [header: string]: string },
  url: string,
  method: string
};

export type HTTPOutgoingResponse = Writable & $ReadOnly<{
  writeHead: (status: number, headers?: { [key: string] : string, ... }) => void,
}>;
*/

const toHttpMethod = (methodName/*: string*/)/*: ?HTTPMethod*/ => {
  switch (methodName) {
    case 'GET':
    case 'POST':
    case 'DELETE':
    case 'PUT':
    case 'HEAD':
    case 'OPTIONS':
    case 'PATCH':
      return methodName;
    default:
      return null;
  }
};

module.exports = {
  toHttpMethod,
};
