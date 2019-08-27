// @flow strict
const { expectAll, emojiReporter, booleanReporter } = require('@lukekaalim/test');

const { expectNoMatchingRoutes, expectMatchFirstRoute, expectDefaultHandleOnRouteThrow } = require('./src/listener.test');
const { expectRestEndpoint } = require('./src/route.test');
const { expectIntegration } = require('./test/integration.test');

const testLibrary = async () => {
  const expectation = expectAll('@lukekaalim/server', [
    expectNoMatchingRoutes,
    expectMatchFirstRoute,
    expectRestEndpoint,
    expectIntegration,
    expectDefaultHandleOnRouteThrow,
  ]);
  const assertion = await expectation.test();
  console.log(emojiReporter(assertion));
  process.exitCode = booleanReporter(assertion) ? 0 : 1
};

if (module === require.main) {
  testLibrary();
}