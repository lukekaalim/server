// @flow strict
const { Writable, Readable } = require('stream');
const { createListener } = require('./listener');
const { assert, expect } = require('@lukekaalim/test');
const { MockIncomingRequest, MockOutgoingResponse } = require('./utils.test');

const expectNoMatchingRoutes = expect(async () => {
  let statusCode = null;
  class Mock404Response extends MockOutgoingResponse {
    constructor() {
      super();
    }
    writeHead(status) {
      statusCode = status;
    }
  }

  const nonMatchingRoute = { test: () => false, handler: async () => {} };
  const listener = createListener([nonMatchingRoute]);
  listener(new MockIncomingRequest('/'), new Mock404Response());
  return assert('Expect to throw a 404 is there are no matching routes', statusCode === 404)
});

const expectMatchFirstRoute = expect(() => {
  let called = false;
  const nonMatchingRoute = { test: () => false, handler: async () => {} };
  const firstMatchingRoute = { test: () => true, handler: async () => { called = true; } };
  const secondMatchingRoute = { test: () => true, handler: async () => {} };
  const listener = createListener([nonMatchingRoute, firstMatchingRoute, secondMatchingRoute]);
  listener(new MockIncomingRequest('/'), new MockOutgoingResponse());
  return assert('Expect the first matching route to be executed', called);
});

const expectDefaultHandleOnRouteThrow = expect(async () => {
  let statusCode = null;
  class Mock500Response extends MockOutgoingResponse {
    constructor() {
      super();
    }
    writeHead(status) {
      statusCode = status;
    }
  }
  const throwingRoute = { test: () => true, handler: async () => { throw new Error('Example Error') } };
  const outgoingResponse = new Mock500Response();
  const listener = createListener([throwingRoute]);
  const receivedEnd = new Promise(res => outgoingResponse.on('finish', res));
  listener(new MockIncomingRequest('/'), outgoingResponse);
  await receivedEnd;
  return assert('Expect the listener, with the default onError handler, to return a 500 response', statusCode === 500);
});

module.exports = {
  expectNoMatchingRoutes,
  expectMatchFirstRoute,
  expectDefaultHandleOnRouteThrow,
};