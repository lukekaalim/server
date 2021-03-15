// @flow strict
const { assert, colorReporter } = require('@lukekaalim/test')
const { assertAccess } = require('./access');

const test = async () => {
  try {
    const assertion = assert('@lukekaalim/server', [
      await assertAccess(),
    ]);
    console.log(colorReporter(assertion))
  } catch (error) {
    console.error(error);
  }
};

test();