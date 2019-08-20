// @flow strict
/*::
import type { Route } from './route';
*/

/*::
export type RESTRequest = {
  query: Map<string, string>,
  headers: Map<string, string>,
  body?: string,
};

export type RESTResponse = {
  status: number,
  headers: Map<string, string>,
  body: string,
};

export type RESTEndpoint = {
  path: string,
  method: string,
  handler: (
    query: Map<string, string>,
    headers: Map<string, string>,
    body?: string,
  ) => Promise<RESTResponse>
};
*/

const ok = (
  body/*: string*/ = '',
  headers/*: Map<string, string>*/ = new Map()
) => ({
  status: 200,
  headers,
  body,
});

const notFound = (
  body/*: string*/ = '',
  headers/*: Map<string, string>*/ = new Map()
) => ({
  status: 404,
  headers,
  body,
});

const badRequest = (
  body/*: string*/ = '',
  headers/*: Map<string, string>*/ = new Map()
) => ({
  status: 400,
  headers,
  body,
})

module.exports = {
  ok,
  notFound,
  badRequest,
};