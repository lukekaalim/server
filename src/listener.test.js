// @flow strict
const { Writable, Readable } = require('stream');
const { createListener } = require('./listener');
const { assert, expect } = require('@lukekaalim/test');
const { MockIncomingRequest, MockOutgoingResponse } = require('./utils.test');

const expectNoMatchingRoutes = expect(async () => {
  let statusCode = null;
  let done = false;
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
})

module.exports = {
  expectNoMatchingRoutes,
  expectMatchFirstRoute,
};