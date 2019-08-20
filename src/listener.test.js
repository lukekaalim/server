// @flow strict
const { Writable, Readable } = require('stream');
const { createListener } = require('./listener');
const { assert, expect, expectToThrow } = require('@lukekaalim/test');
const { MockIncomingRequest, MockOutgoingResponse } = require('./utils.test');

const expectNoMatchingRoutes = expectToThrow('Expect the Listener to throw an error if no routes match', () => {
  const nonMatchingRoute = { test: () => false, handler: async () => {} };
  const listener = createListener([nonMatchingRoute]);
  listener(new MockIncomingRequest('/'), new MockOutgoingResponse());
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