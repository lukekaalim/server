// @flow strict
/*::
import type { HTTPIncomingRequest } from './http';
import type { Listener } from './listener';
*/
const { Writable, Readable } = require('stream');

class MockIncomingRequest extends Readable {
/*::
  headers: { [header: string]: string };
  url: string;
  method: string;
  body: string;
*/

  constructor(
    url/*: string*/ = '/',
    method/*: string*/ = 'GET',
    body/*: string*/ = '',
    headers/*: { [header: string]: string }*/ = {},
  ) {
    super();
    this.url = url;
    this.method = method;
    this.body = body;
    this.headers = headers;
  }
  _read() {
    this.push();
    this.push(null);
  }
}

class MockOutgoingResponse extends Writable {
  /*::
  body: string;
  status: number;
  headers: { [header: string]: string };
  */
  constructor() {
    super();
    this.body = '';
  }
  _write(chunk/*: string | Buffer*/, encoding/*: string*/, callback/*: () => void*/) {
    if (typeof chunk === 'string') {
      this.body += chunk;
    } else {
      this.body += chunk.toString();
    }
    callback();
  }
  writeHead(status/*: number*/, headers/*: { [header: string]: string }*/ = {}) {
    this.status = status;
    this.headers = headers;
  }
}

const requestListener = (
  request/*: HTTPIncomingRequest*/,
  listener/*: Listener*/
)/*: Promise<MockOutgoingResponse>*/ => new Promise(resolve => {
  const response = new MockOutgoingResponse();
  response.once('finish', () => resolve(response));
  listener(request, response);
});

module.exports = {
  MockIncomingRequest,
  MockOutgoingResponse,
  requestListener,
};
