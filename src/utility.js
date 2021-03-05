// @flow strict
/*:: import type { RouteRequest, RouteResponse } from './route'; */
/*:: import type { HTTPHeaders, HTTPIncomingRequest, HTTPOutgoingResponse, HTTPMethod } from './http'; */
const { createRouteResponse } = require('./route');
const { toStatusCode } = require('./http');
const { Readable, Writable } = require('stream');

class MockHTTPIncomingRequest extends Readable {
  /*:: headers: HTTPHeaders*/;
  /*:: url: string*/;
  /*:: method: string*/;
  /*:: body: Buffer*/;

  constructor(
    headers/*: HTTPHeaders*/, 
    url/*: string*/,
    method/*: HTTPMethod*/,
    body/*: Buffer*/
  ) {
    super();
    this.headers = headers;
    this.url = url;
    this.method = method;
    this.body = body;
  }
  _read(size/*: number*/) {
    this.push(this.body);
    this.push(null);
  }
}

class MockHTTPOutgoingResponse extends Writable {
  /*:: headers: HTTPHeaders*/;
  /*:: status: number*/;
  /*:: body: Buffer[]*/;

  constructor() {
    super();
    this.body = [];
  }

  writeHead(status/*: number*/, headers/*: HTTPHeaders*/ = {}) {
    this.status = status;
    this.headers = headers;
  }

  _write(chunk/*: string | Buffer*/, encoding/*: string*/, callback/*: (error?: Error) => void*/) {
    if (typeof chunk === 'string')
      this.body.push(Buffer.from(chunk));
    else 
      this.body.push(chunk);
    callback();
  }

  async readResponse()/*: Promise<RouteResponse>*/ {
    await new Promise((resolve, reject) => (this.on('finish', resolve), this.on('error', reject)));
    return createRouteResponse(toStatusCode(this.status), this.headers, this.body.join())
  }
}

module.exports = {
  MockHTTPIncomingRequest,
  MockHTTPOutgoingResponse,
  mocks: { request: MockHTTPIncomingRequest, response: MockHTTPOutgoingResponse }
};
