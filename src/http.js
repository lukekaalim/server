// @flow strict
/*::
import type { Readable, Writable } from 'stream';
import type { ContentType } from './mime';
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

export type HTTPContentHeaders = {|
  'content-type': null | ContentType,
  'content-length': null | number,
|};

export type HTTPRequestHeaders = {
  [string]: string,
  ...HTTPContentHeaders
};
export type HTTPResponseHeaders = {
  [string]: string,
};

export type HTTPIncomingRequest = Readable & {
  headers: { [header: string]: string },
  url: string,
  method: string
};

export type HTTPOutgoingResponse = Writable & $ReadOnly<{
  writeHead: (status: number, headers?: { [key: string]: string, ... }) => void,
}>;
*/

const toHttpContentHeaders = (headers/*: { [string]: string }*/)/*: HTTPContentHeaders*/ => {
  const contentType = headers['content-type'] || null;
  const contentLength = headers['content-length'] ? parseInt(headers['content-length'], 10) : null;

  return {
    // $FlowFixMe
    'content-type': contentType,
    'content-length': contentLength,
  }
};

const toHttpRequestHeaders = (headers/*: { [string]: string }*/)/*: HTTPRequestHeaders*/ => {
  return {
    ...headers,
    ...toHttpContentHeaders(headers),
  }
};

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

  toHttpContentHeaders,
  toHttpRequestHeaders,
};
