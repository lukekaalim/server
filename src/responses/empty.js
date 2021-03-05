// @flow strict
/*:: import type { HTTPStatus, HTTPHeaders } from '../http'; */
/*:: import type { RouteResponse } from '../route'; */
const { statusCodes: { noContent }} = require('../http');

const createEmptyResponse = (status/*: HTTPStatus*/ = noContent, headers/*: HTTPHeaders*/ = {})/*: RouteResponse*/ => ({
  status,
  headers: { ...headers, 'content-length': '0' },
  body: null,
});

module.exports = {
  createEmptyResponse,
  empty: createEmptyResponse,
};
