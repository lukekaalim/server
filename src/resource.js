// @flow strict
/*:: import type { Readable } from 'stream'; */
/*:: import type { RouteRequest } from './request'; */
/*:: import type { JSONValue } from './json'; */
const { readStream } = require('./stream');
const { parse } = require("./json");

/*::
export type Authorization =
  | { type: 'unknown', value: string }
  | { type: 'none' }
  | { type: 'basic', username: string, password: string }
  | { type: 'bearer', token: string }

export type Content =
  | { type: 'unknown', contentLength: ?number, stream: Readable }
  | { type: 'none' }
  | { type: 'text', value: string }
  | { type: 'json', value: JSONValue }
  | { type: 'bad', message: string }
  | { type: 'bytes', contentLength: ?number, stream: Readable }
  | { type: 'audio', format: string, contentLength: ?number, audioStream: Readable }
  | { type: 'image', format: string, contentLength: ?number, imageStream: Readable }
  | { type: 'video', format: string, contentLength: ?number, videoStream: Readable }

export type ResourceRequest = {
  ...RouteRequest,
  auth: Authorization,
  content: Content
};
*/

const getAuthorization = (head/*: RouteRequest*/)/*: Authorization*/ => {
  const authorizationValue = head.headers['authorization'];

  if (!authorizationValue)
    return { type: 'none' };
  const [type, credentials] = authorizationValue.split(' ', 2);
  switch (type.toLowerCase()) {
    case 'basic': {
      const [username, password] = Buffer.from(credentials, 'base64').toString('utf8').split(':', 2);
      return { type: 'basic', username, password }
    }
    case 'bearer':
      return { type: 'bearer', token: credentials }
    default:
      return { type: 'unknown', value: authorizationValue };
  }
}

const requestAllowsContent = (head/*: RouteRequest*/) => {
  switch (head.method.toUpperCase()) {
    case 'HEAD':
    case 'GET':
    case 'OPTIONS':
      return false;
    default:
      return true;
  }
};

const getContent = async (head/*: RouteRequest*/)/*: Promise<Content>*/ => {
  if (!requestAllowsContent(head))
    return { type: 'none' };
  const contentType = head.headers['content-type'] || '';
  const contentLengthValue = head.headers['content-length'];
  const contentLength = contentLengthValue ? parseInt(contentLengthValue, 10) : null;
  
  const [type, subtype] = contentType.split('/', 2);

  switch (type) {
    case '':
    case undefined:
      return { type: 'none' };
    case 'application': {
      switch (subtype) {
        case 'octet-stream':
          return { type: 'bytes', contentLength, stream: head.stream };
        case 'json':
          try {
            return { type: 'json', value: parse(await readStream(head.stream, contentLength)) };
          } catch (error) {
            return { type: 'bad', message: error.message };
          }
        default:
          return { type: 'unknown', contentLength, stream: head.stream };
      }
    }
    case 'text':
      return { type: 'text', value: await readStream(head.stream, contentLength) };
    case 'image':
      return { type: 'image', format: subtype, contentLength, imageStream: head.stream };
    case 'video':
      return { type: 'video', format: subtype, contentLength, videoStream: head.stream };
    case 'audio':
      return { type: 'audio', format: subtype, contentLength, audioStream: head.stream };
    default:
      return { type: 'unknown', contentLength, stream: head.stream };
  }
}

const getResourceRequest = async (head/*: RouteRequest*/)/*: Promise<ResourceRequest>*/ => {
  const auth = getAuthorization(head);
  const content = await getContent(head);

  return {
    ...head,
    auth,
    content,
  };
};

module.exports = {
  getContent,
  getAuthorization,
  getResourceRequest,
};
