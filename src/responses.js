// @flow strict

/*::
export type * from './responses/application';
export type * from './responses/text';
export type * from './responses/empty';
*/

module.exports = {
  ...require('./responses/application'),
  ...require('./responses/text'),
  ...require('./responses/empty'),
  responses: {
    ...require('./responses/application'),
    ...require('./responses/text'),
    ...require('./responses/empty'),
  },
};
