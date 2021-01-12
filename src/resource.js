// @flow strict
/*:: import type { Readable } from 'stream'; */
/*:: import type { RouteRequest } from './request'; */
/*:: import type { JSONValue } from './json'; */
/*:: import type { Content, StreamContent, NoContent, JSONContent } from './content'; */
const { parseStreamContent } = require('./content');
const { readStream } = require('./stream');
const { parse } = require("./json");

/*::
export type Authorization =
  | { type: 'unknown', value: string }
  | { type: 'none' }
  | { type: 'basic', username: string, password: string }
  | { type: 'bearer', token: string }
export type ResourceRequest = {
  ...RouteRequest,
  auth: Authorization,
  content: ?StreamContent,
  parseContent: (acceptOnly?: string[]) => Promise<Content>,
  parseJSON: () => Promise<JSONContent>,
  validateJSON: <T>(validator: JSONValue => T) => Promise<T>,
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

const getContent = (request/*: RouteRequest*/)/*: ?StreamContent*/ => {
  if (!requestAllowsContent(request))
    return null;
  
  const contentType = request.headers['content-type'] || '';
  const contentLengthValue = request.headers['content-length'];
  const contentLength = contentLengthValue ? parseInt(contentLengthValue, 10) : null;

  return { type: 'stream', stream: request.stream, contentType, contentLength };
};

const getResourceRequest = (request/*: RouteRequest*/)/*: ResourceRequest*/ => {
  const auth = getAuthorization(request);
  const content = getContent(request);

  const parseContent = async (acceptOnly) => {
    const parsedContent = await parseStreamContent(content, acceptOnly);
    if (!parsedContent)
      throw new TypeError(`Expected request body, but found nothing`);
    return parsedContent;
  };
  const parseJSON = async ()/*: Promise<JSONContent>*/ => {
    const parsedContent = await parseContent();
    if (parsedContent.type !== 'json')
      throw new TypeError(`Expected JSON in request, but found ${content && content.contentType || 'unknown content type'}`);
    return parsedContent;
  };
  const validateJSON = async /*::<T>*/(validator/*: JSONValue => T*/)/*: Promise<T>*/ => {
    const parsedContent = await parseJSON();
    return validator(parsedContent.value);
  }
  
  return {
    ...request,
    auth,
    content,
    parseContent,
    parseJSON,
    validateJSON,
  };
};

module.exports = {
  getContent,
  getAuthorization,
  getResourceRequest,
};
