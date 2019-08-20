// @flow strict
const { expectAll, emojiReporter, booleanReporter } = require('@lukekaalim/test');

const { expectNoMatchingRoutes, expectMatchFirstRoute } = require('./src/listener.test');
const { expectRestEndpoint } = require('./src/route.test');

const testLibrary = async () => {
  const expectation = expectAll('@lukekaalim/server', [
    expectNoMatchingRoutes,
    expectMatchFirstRoute,
    expectRestEndpoint,
  ]);
  const assertion = await expectation.test();
  console.log(emojiReporter(assertion));
  process.exitCode = booleanReporter(assertion) ? 0 : 1
};

if (module === require.main) {
  testLibrary();
}