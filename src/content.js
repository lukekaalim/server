// @flow strict
/*:: import type { Readable } from 'stream'; */
/*:: import type { RouteRequest } from './request'; */
/*:: import type { JSONValue } from './json'; */
const { readStream } = require('./stream');
const { parse } = require("./json");

/*::
export type NoContent = null;
export type TextContent = { type: 'text', value: string };
export type JSONContent = { type: 'json', value: JSONValue };
export type StreamContent = { type: 'stream', contentType: ?string, contentLength: ?number, stream: Readable };

export type Content =
  | TextContent
  | JSONContent
  | StreamContent
*/

const parseStreamContent = async (content/*: ?StreamContent*/, acceptOnly/*: ?string[]*/ = null)/*: Promise<?Content>*/ => {
  if (!content)
    return null;
  const { contentType, contentLength, stream } = content;
  if (!contentType || contentLength === 0)
    return null;

  if (acceptOnly && !acceptOnly.includes(contentType))
    return null;

  switch (contentType) {
    case 'text/plain':
      return { type: 'text', value: await readStream(stream, contentLength) };
    case 'application/json':
      return { type: 'json', value: parse(await readStream(stream, contentLength)) };
    default:
      return content;
  }
}

module.exports = {
  parseStreamContent,
};
