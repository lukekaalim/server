// @flow strict
const { expect, assert, expectAll } = require('@lukekaalim/test');
const { MockIncomingRequest, MockOutgoingResponse } = require('./utils.test');
const { createRESTRoute, createRESTResponse } = require('./rest');

const expectMatchRoute = (description, endpoint, request) => expect(() => {
  const route = createRESTRoute('GET', endpoint.path, endpoint.handler);
  return assert(description, route.test(request));
});

const expectMissRoute = (description, endpoint, request) => expect(() => {
  const route = createRESTRoute('GET', endpoint.path, endpoint.handler);
  return assert(description, !route.test(request));
});

const expectRestMatchesPathAndMethod = expectMatchRoute(
  'Expect route is matched when the path and the method match',
  { path: '/', method: 'GET', handler: async () => createRESTResponse(200) },
  new MockIncomingRequest('/', 'GET')
);

const expectRestMismatchedPath = expectMissRoute(
  'Expect route is not matched when the path is wrong',
  { path: '/expected-path', method: 'GET', handler: async () => createRESTResponse(200) },
  new MockIncomingRequest('/different-path', 'GET')
);

const expectRestMismatchedMethod = expectMissRoute(
  'Expect route is not matched when the method is wrong',
  { path: '/expected-path', method: 'GET', handler: async () => createRESTResponse(200) },
  new MockIncomingRequest('/expected-path', 'POST')
);

const expectRestCompileHeadersIntoMap = expect(async () => {
  let headers = new Map();
  const route = createRESTRoute('GET', '/expected-path', async (q, h) => { headers = h; return createRESTResponse(200); });
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