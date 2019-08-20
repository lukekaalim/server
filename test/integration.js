// @flow strict
const { expect, assert } = require('@lukekaalim/test');


const expectIntegration = expect(() => {
  return assert('Expect the application to intergrade with real services properly', false);
});

module.exports = {
  expectIntegration,
};
