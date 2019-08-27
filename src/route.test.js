// @flow strict
const { expect, assert, expectAll } = require('@lukekaalim/test');
const { createGETRoute } = require('./rest');
const { MockIncomingRequest, MockOutgoingResponse } = require('./utils.test');
const { ok } = require('./rest');

const expectMatchRoute = (description, endpoint, request) => expect(() => {
  const route = createGETRoute(endpoint.path, endpoint.handler);
  return assert(description, route.test(request));
});

const expectMissRoute = (description, endpoint, request) => expect(() => {
  const route = createGETRoute(endpoint.path, endpoint.handler);
  return assert(description, !route.test(request));
});

const expectRestMatchesPathAndMethod = expectMatchRoute(
  'Expect route is matched when the path and the method match',
  { path: '/', method: 'GET', handler: async () => ok() },
  new MockIncomingRequest('/', 'GET')
);

const expectRestMismatchedPath = expectMissRoute(
  'Expect route is not matched when the path is wrong',
  { path: '/expected-path', method: 'GET', handler: async () => ok() },
  new MockIncomingRequest('/different-path', 'GET')
);

const expectRestMismatchedMethod = expectMissRoute(
  'Expect route is not matched when the method is wrong',
  { path: '/expected-path', method: 'GET', handler: async () => ok() },
  new MockIncomingRequest('/expected-path', 'POST')
);

const expectRestCompileHeadersIntoMap = expect(async () => {
  let headers = new Map();
  const route = createGETRoute('/expected-path', async (q, h) => { headers = h; return ok(); });
  const exampleHeaders = ['Example-Header', 'Header-Value'];

  await route.handler(new MockIncomingRequest('/expected-path', 'GET', '', exampleHeaders), new MockOutgoingResponse())
  return assert('Expect endpoint to turn raw headers into a map', headers.get('Example-Header') === 'Header-Value');
});

const expectRestEndpoint = expectAll('createRouteFromRESTEndpoint()', [
  expectRestMatchesPathAndMethod,
  expectRestMismatchedPath,
  expectRestMismatchedMethod,
  expectRestCompileHeadersIntoMap,
]);

module.exports = {
  expectRestEndpoint,
};