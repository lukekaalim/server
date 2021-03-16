// @flow strict
/*:: import type { Readable } from 'stream'; */
/*:: import type { HTTPHeaders, HTTPIncomingRequest } from './http'; */
/*:: import type { RouteRequest } from './route'; */
/*:: import type { JSONValue } from './json'; */
const { readStream } = require('./stream');
const { parse } = require("./json");

/*::
export type Content = { type: null | string, length: null | number };
*/

const getContent = (headers/*: HTTPHeaders*/)/*: $Exact<Content>*/ => {
  const type = headers['content-type'] || null;
  const length = headers['content-length'] ? parseInt(headers['content-length'], 10) : null;
  return {
    type,
    length
  };
};

const readJSONBody = async (incoming/*: Readable*/, headers/*: HTTPHeaders*/)/*: Promise<JSONValue>*/ => {
  const content = getContent(headers);
  return parse(await readStream(incoming, content.length));
};
const readTextBody = async (incoming/*: Readable*/, headers/*: HTTPHeaders*/)/*: Promise<string>*/ => {
  const content = getContent(headers);
  return await readStream(incoming, content.length);
};

const readBody = async (incoming/*: Readable*/, headers/*: HTTPHeaders*/)/*: Promise<JSONValue | string>*/ => {
  const content = getContent(headers);
  switch (content.type) {
    case 'application/json':
      return readJSONBody(incoming, headers);
    case 'text/plain':
      return readTextBody(incoming, headers);
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
