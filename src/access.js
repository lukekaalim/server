// @flow strict
/*:: import type { HTTPHeaders } from './http'; */

/*::
export type AccessOriginOptions =
  | { type: 'whitelist', origins: string[] }
  | { type: 'wildcard' }
  | { type: 'none' }

export type AccessOptions = {
  origins?: AccessOriginOptions,
};
*/

const createOriginWhitelist = (origins/*: string[]*/)/*: AccessOriginOptions*/ => ({
  type: 'whitelist',
  origins
});

const createAllowedOrigin = (headers/*: HTTPHeaders*/, options/*: AccessOriginOptions*/) => {
  switch (options.type) {
    case 'wildcard':
      return '*';
    case 'whitelist':
      return options.origins.includes(headers['origin']) ? headers['origin'] : null;
  }
}

const createAccessHeaders = (headers/*: HTTPHeaders*/, access/*: AccessOptions*/ = {})/*: HTTPHeaders*/ => {
  const allowedOrigin = access.origins ? createAllowedOrigin(headers, access.origins) : null;
  return Object.fromEntries([
    allowedOrigin ? ['access-control-allow-origin', allowedOrigin] : null,
  ].filter(Boolean));
};

module.exports = {
  createAccessHeaders,
  createOriginWhitelist,
};
