// @flow strict
const { Writable, Readable } = require('stream');
const { createListener } = require('./listener');
const { assert, expect } = require('@lukekaalim/test');
const { notFound, ok } = require('./responses');
const { MockIncomingRequest, requestListener } = require('./utils.test');

const expectNoMatchingRoutes = expect(async () => {
  const nonMatchingRoute = { path: '/', method: 'GET', handler: () => ok() }
  const listener = createListener([nonMatchingRoute], () => notFound());

  const response = await requestListener(new MockIncomingRequest('/not-root'), listener);
  return assert('Expect to return a 404', response.status === 404)
});

const expectMatchingRoutes = expect(async () => {
  const nonMatchingRoute = { path: '/', method: 'GET', handler: () => ok() }
  const listener = createListener([nonMatchingRoute], () => notFound());

  const response = await requestListener(new MockIncomingRequest('/'), listener);
  return assert('Expect to return 200 respone', response.status === 200)
});

module.exports = {
  expectMatchingRoutes,
  expectNoMatchingRoutes,
};