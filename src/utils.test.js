// @flow strict
const { Writable, Readable } = require('stream');

class MockIncomingRequest extends Readable {
  done/*: boolean*/;
  rawHeaders/*: Array<string>*/;
  url/*: string*/;
  method/*: string*/;
  body/*: string*/;

  constructor(
    url/*: string*/ = '/',
    method/*: string*/ = 'GET',
    body/*: string*/ = '',
    rawHeaders/*: Array<string>*/ = [],
  ) {
    super();
    this.done = false;
    this.url = url;
    this.method = method;
    this.body = body;
    this.rawHeaders = rawHeaders;
  }
  _read() {
    if (!this.done) {
      this.push();
      this.done = true;
    }
    this.push(null);
  }
}

class MockOutgoingResponse extends Writable {
  constructor() {
    super();
  }
  _write(chunk/*: string | Buffer*/, encoding/*: string*/, callback/*: () => void*/) {
    callback();
  }
  writeHead() {}
}

module.exports = {
  MockIncomingRequest,
  MockOutgoingResponse,
};
