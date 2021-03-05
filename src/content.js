// @flow strict
/*:: import type { HTTPHeaders, HTTPIncomingRequest } from './http'; */
/*:: import type { RouteRequest } from './route'; */
/*:: import type { JSONValue } from './json'; */
const { readStream } = require('./stream');
const { parse } = require("./json");

/*::
export type Content = { type: null | string, length: null | number };
*/

const getContent = (headers/*: HTTPHeaders*/)/*: Content*/ => {
  const type = headers['content-type'] || null;
  const length = headers['content-length'] ? parseInt(headers['content-length'], 10) : null;
  return {
    type,
    length
  };
};

const readJSONBody = async (request/*: RouteRequest*/, content/*: Content*/)/*: Promise<JSONValue>*/ => {
  return parse(await readStream(request.incoming, content.length));
};
const readTextBody = async (request/*: RouteRequest*/, content/*: Content*/)/*: Promise<string>*/ => {
  return await readStream(request.incoming, content.length);
};

const readBody = async (request/*: RouteRequest*/)/*: Promise<JSONValue | string>*/ => {
  const content = getContent(request.headers);
  switch (content.type) {
    case 'application/json':
      return readJSONBody(request, content);
    case 'text/plain':
      return readTextBody(request, content);
    default:
    case null:
      return null;
  }
};

module.exports = {
  getContent,
  readJSONBody,
  readBody,
};
